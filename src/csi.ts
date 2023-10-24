import { unzip } from '@gmod/bgzf-filehandle'
import VirtualOffset, { fromBytes } from './virtualOffset'
import Chunk from './chunk'
import {
  optimizeChunks,
  findFirstData,
  parsePseudoBin,
  parseNameBytes,
  BaseOpts,
} from './util'

import IndexFile from './indexFile'

const CSI1_MAGIC = 21582659 // CSI\1
const CSI2_MAGIC = 38359875 // CSI\2

function lshift(num: number, bits: number) {
  return num * 2 ** bits
}
function rshift(num: number, bits: number) {
  return Math.floor(num / 2 ** bits)
}

export default class CSI extends IndexFile {
  private maxBinNumber = 0
  private depth = 0
  private minShift = 0

  public setupP?: ReturnType<CSI['_parse']>

  async lineCount(refId: number, opts?: BaseOpts) {
    const indexData = await this.parse(opts)
    return indexData.indices[refId]?.stats?.lineCount || 0
  }

  async indexCov() {
    return []
  }

  parseAuxData(bytes: Uint8Array, offset: number) {
    const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)
    const formatFlags = dv.getInt32(offset, true)
    const coordinateType =
      formatFlags & 0x10000 ? 'zero-based-half-open' : '1-based-closed'
    const format = (
      { 0: 'generic', 1: 'SAM', 2: 'VCF' } as {
        [key: number]: string
      }
    )[formatFlags & 0xf]
    if (!format) {
      throw new Error(`invalid Tabix preset format flags ${formatFlags}`)
    }
    const columnNumbers = {
      ref: dv.getInt32(offset + 4, true),
      start: dv.getInt32(offset + 8, true),
      end: dv.getInt32(offset + 12, true),
    }
    const metaValue = dv.getInt32(offset + 16, true)
    const metaChar = metaValue ? String.fromCharCode(metaValue) : ''
    const skipLines = dv.getInt32(offset + 20, true)
    const nameSectionLength = dv.getInt32(offset + 24, true)

    return {
      columnNumbers,
      coordinateType,
      metaValue,
      metaChar,
      skipLines,
      format,
      formatFlags,
      ...parseNameBytes(
        bytes.subarray(offset + 28, offset + 28 + nameSectionLength),
        this.renameRefSeq,
      ),
    }
  }

  // fetch and parse the index
  async _parse(opts: { signal?: AbortSignal }) {
    const buffer = await this.filehandle.readFile(opts)
    const bytes = await unzip(buffer)
    const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength)

    let csiVersion
    const m = dv.getUint32(0, true)
    // check TBI magic numbers
    if (m === CSI1_MAGIC) {
      csiVersion = 1
    } else if (m === CSI2_MAGIC) {
      csiVersion = 2
    } else {
      throw new Error('Not a CSI file')
    }

    this.minShift = dv.getInt32(4, true)
    this.depth = dv.getInt32(8, true)
    this.maxBinNumber = ((1 << ((this.depth + 1) * 3)) - 1) / 7
    const auxLength = dv.getInt32(12, true)
    const aux = auxLength >= 30 ? this.parseAuxData(bytes, 16) : undefined
    const refCount = dv.getInt32(16 + auxLength, true)

    type BinIndex = { [key: string]: Chunk[] }

    // read the indexes for each reference sequence
    let curr = 16 + auxLength + 4
    let firstDataLine: VirtualOffset | undefined
    const indices = new Array<{
      binIndex: BinIndex
      stats?: { lineCount: number }
    }>(refCount)
    for (let i = 0; i < refCount; i++) {
      // the binning index
      const binCount = dv.getInt32(curr, true)
      curr += 4
      const binIndex: { [key: string]: Chunk[] } = {}
      let stats // < provided by parsing a pseudo-bin, if present
      for (let j = 0; j < binCount; j++) {
        const bin = dv.getUint32(curr, true)
        curr += 4
        if (bin > this.maxBinNumber) {
          stats = parsePseudoBin(bytes, curr + 28)
          curr += 28 + 16
        } else {
          firstDataLine = findFirstData(firstDataLine, fromBytes(bytes, curr))
          curr += 8
          const chunkCount = dv.getInt32(curr, true)
          curr += 4
          const chunks = new Array<Chunk>(chunkCount)
          for (let k = 0; k < chunkCount; k += 1) {
            const u = fromBytes(bytes, curr)
            curr += 8
            const v = fromBytes(bytes, curr)
            curr += 8
            firstDataLine = findFirstData(firstDataLine, u)
            chunks[k] = new Chunk(u, v, bin)
          }
          binIndex[bin] = chunks
        }
      }

      indices[i] = { binIndex, stats }
    }

    return {
      csiVersion,
      firstDataLine,
      indices,
      refCount,
      csi: true,
      maxBlockSize: 1 << 16,
      ...aux,
    }
  }

  async blocksForRange(
    refId: number,
    min: number,
    max: number,
    opts: BaseOpts = {},
  ) {
    if (min < 0) {
      min = 0
    }

    const indexData = await this.parse(opts)
    const ba = indexData?.indices[refId]
    if (!ba) {
      return []
    }
    const overlappingBins = this.reg2bins(min, max)

    if (overlappingBins.length === 0) {
      return []
    }

    const chunks = []
    // Find chunks in overlapping bins.  Leaf bins (< 4681) are not pruned
    for (const [start, end] of overlappingBins) {
      for (let bin = start; bin <= end; bin++) {
        if (ba.binIndex[bin]) {
          const binChunks = ba.binIndex[bin]
          for (const c of binChunks) {
            chunks.push(c)
          }
        }
      }
    }

    return optimizeChunks(chunks, new VirtualOffset(0, 0))
  }

  /**
   * calculate the list of bins that may overlap with region [beg,end)
   * (zero-based half-open)
   */
  reg2bins(beg: number, end: number) {
    beg -= 1 // < convert to 1-based closed
    if (beg < 1) {
      beg = 1
    }
    if (end > 2 ** 50) {
      end = 2 ** 34
    } // 17 GiB ought to be enough for anybody
    end -= 1
    let l = 0
    let t = 0
    let s = this.minShift + this.depth * 3
    const bins = []
    for (; l <= this.depth; s -= 3, t += lshift(1, l * 3), l += 1) {
      const b = t + rshift(beg, s)
      const e = t + rshift(end, s)
      if (e - b + bins.length > this.maxBinNumber) {
        throw new Error(
          `query ${beg}-${end} is too large for current binning scheme (shift ${this.minShift}, depth ${this.depth}), try a smaller query or a coarser index binning scheme`,
        )
      }
      bins.push([b, e])
    }
    return bins
  }

  async parse(opts: BaseOpts = {}) {
    if (!this.setupP) {
      this.setupP = this._parse(opts).catch(e => {
        this.setupP = undefined
        throw e
      })
    }
    return this.setupP
  }

  async hasRefSeq(seqId: number, opts: BaseOpts = {}) {
    const header = await this.parse(opts)
    return !!header.indices[seqId]?.binIndex
  }
}
