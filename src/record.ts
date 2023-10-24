/* eslint-disable @typescript-eslint/no-empty-function */
import Constants from './constants'

const SEQRET_DECODER = '=ACMGRSVTWYHKDBN'.split('')
const CIGAR_DECODER = 'MIDNSHP=X???????'.split('')

/**
 * Class of each BAM record returned by this API.
 */
export default class BamRecord {
  private data = {} as { [key: string]: any }
  private bytes: { start: number; end: number; byteArray: Uint8Array }
  private dv: DataView
  private _id: number
  private _tagOffset: number | undefined
  private _tagList: string[] = []
  private _allTagsParsed = false

  public flags: any
  public _refID: number
  constructor(args: any) {
    const { bytes, fileOffset } = args
    const { start } = bytes
    this.data = {}
    this.bytes = bytes
    this._id = fileOffset
    this.dv = new DataView(
      this.bytes.byteArray.buffer,
      this.bytes.byteArray.byteOffset,
      this.bytes.byteArray.byteLength,
    )
    this._refID = this.dv.getInt32(start + 4, true)
    this.data.start = this.dv.getInt32(start + 8, true)
    this.flags = (this.dv.getInt32(start + 16, true) & 0xffff0000) >> 16
  }

  get(field: string) {
    //@ts-expect-error
    if (this[field]) {
      if (this.data[field]) {
        return this.data[field]
      }
      //@ts-expect-error
      this.data[field] = this[field]()
      return this.data[field]
    }
    return this._get(field.toLowerCase())
  }

  end() {
    return this.get('start') + this.get('length_on_ref')
  }

  seq_id() {
    return this._refID
  }

  // same as get(), except requires lower-case arguments.  used
  // internally to save lots of calls to field.toLowerCase()
  _get(field: string) {
    if (field in this.data) {
      return this.data[field]
    }
    this.data[field] = this._parseTag(field)
    return this.data[field]
  }

  _tags() {
    this._parseAllTags()

    let tags = ['seq']

    if (!this.isSegmentUnmapped()) {
      tags.push(
        'start',
        'end',
        'strand',
        'score',
        'qual',
        'MQ',
        'CIGAR',
        'length_on_ref',
        'template_length',
      )
    }
    if (this.isPaired()) {
      tags.push('next_segment_position', 'pair_orientation')
    }
    tags = tags.concat(this._tagList || [])

    for (const k of Object.keys(this.data)) {
      if (k[0] !== '_' && k !== 'next_seq_id') {
        tags.push(k)
      }
    }

    const seen: { [key: string]: boolean } = {}
    return tags.filter(t => {
      if (
        (t in this.data && this.data[t] === undefined) ||
        t === 'CG' ||
        t === 'cg'
      ) {
        return false
      }

      const lt = t.toLowerCase()
      const s = seen[lt]
      seen[lt] = true
      return !s
    })
  }

  parent() {
    return
  }

  children() {
    return this.get('subfeatures')
  }

  id() {
    return this._id
  }

  // special parsers
  /**
   * Mapping quality score.
   */
  mq() {
    const mq = (this.get('_bin_mq_nl') & 0xff00) >> 8
    return mq === 255 ? undefined : mq
  }

  score() {
    return this.get('mq')
  }

  qual() {
    return this.qualRaw()?.join(' ')
  }

  qualRaw() {
    if (this.isSegmentUnmapped()) {
      return
    }

    const { start, byteArray } = this.bytes
    const p =
      start +
      36 +
      this.get('_l_read_name') +
      this.get('_n_cigar_op') * 4 +
      this.get('_seq_bytes')
    const lseq = this.get('seq_length')
    return byteArray.subarray(p, p + lseq)
  }

  strand() {
    return this.isReverseComplemented() ? -1 : 1
  }

  multi_segment_next_segment_strand() {
    if (this.isMateUnmapped()) {
      return
    }
    return this.isMateReverseComplemented() ? -1 : 1
  }

  name() {
    return this.get('_read_name')
  }

  _read_name() {
    const nl = this.get('_l_read_name')
    const { byteArray, start } = this.bytes
    const decoder = new TextDecoder('ascii')
    return decoder.decode(byteArray.subarray(start + 36, start + 36 + nl - 1))
  }

  /**
   * Get the value of a tag, parsing the tags as far as necessary.
   * Only called if we have not already parsed that field.
   */
  _parseTag(tagName?: string) {
    // if all of the tags have been parsed and we're still being
    // called, we already know that we have no such tag, because
    // it would already have been cached.
    if (this._allTagsParsed) {
      return
    }

    const { byteArray, start } = this.bytes
    let p =
      this._tagOffset ||
      start +
        36 +
        this.get('_l_read_name') +
        this.get('_n_cigar_op') * 4 +
        this.get('_seq_bytes') +
        this.get('seq_length')

    const blockEnd = this.bytes.end
    let lcTag
    while (p < blockEnd && lcTag !== tagName) {
      const tag = String.fromCharCode(byteArray[p], byteArray[p + 1])
      lcTag = tag.toLowerCase()
      const type = String.fromCharCode(byteArray[p + 2])
      p += 3

      let value
      switch (type) {
        case 'A': {
          value = String.fromCharCode(byteArray[p])
          p += 1
          break
        }
        case 'i': {
          value = this.dv.getInt32(p, true)
          p += 4
          break
        }
        case 'I': {
          value = this.dv.getUint32(p, true)
          p += 4
          break
        }
        case 'c': {
          value = this.dv.getInt8(p)
          p += 1
          break
        }
        case 'C': {
          value = this.dv.getUint8(p)
          p += 1
          break
        }
        case 's': {
          value = this.dv.getInt16(p, true)
          p += 2
          break
        }
        case 'S': {
          value = this.dv.getUint16(p, true)
          p += 2
          break
        }
        case 'f': {
          value = this.dv.getFloat32(p, true)
          p += 4
          break
        }
        case 'Z':
        case 'H': {
          value = ''
          while (p <= blockEnd) {
            const cc = byteArray[p++]
            if (cc === 0) {
              break
            } else {
              value += String.fromCharCode(cc)
            }
          }
          break
        }
        case 'B': {
          value = ''
          const cc = byteArray[p++]
          const Btype = String.fromCharCode(cc)
          const limit = this.dv.getInt32(p, true)
          p += 4
          if (Btype === 'i') {
            if (tag === 'CG') {
              for (let k = 0; k < limit; k++) {
                const cigop = this.dv.getUint32(p, true)
                const lop = cigop >> 4
                const op = CIGAR_DECODER[cigop & 0xf]
                value += lop + op
                p += 4
              }
            } else {
              for (let k = 0; k < limit; k++) {
                value += this.dv.getInt32(p, true)
                if (k + 1 < limit) {
                  value += ','
                }
                p += 4
              }
            }
          }
          if (Btype === 'I') {
            if (tag === 'CG') {
              for (let k = 0; k < limit; k++) {
                const cigop = this.dv.getInt32(p, true)
                const lop = cigop >> 4
                const op = CIGAR_DECODER[cigop & 0xf]
                value += lop + op
                p += 4
              }
            } else {
              for (let k = 0; k < limit; k++) {
                value += this.dv.getUint32(p, true)
                if (k + 1 < limit) {
                  value += ','
                }
                p += 4
              }
            }
          }
          if (Btype === 's') {
            for (let k = 0; k < limit; k++) {
              value += this.dv.getInt16(p, true)
              if (k + 1 < limit) {
                value += ','
              }
              p += 2
            }
          }
          if (Btype === 'S') {
            for (let k = 0; k < limit; k++) {
              value += this.dv.getUint16(p, true)
              if (k + 1 < limit) {
                value += ','
              }
              p += 2
            }
          }
          if (Btype === 'c') {
            for (let k = 0; k < limit; k++) {
              value += this.dv.getInt8(p)
              if (k + 1 < limit) {
                value += ','
              }
              p += 1
            }
          }
          if (Btype === 'C') {
            for (let k = 0; k < limit; k++) {
              value += this.dv.getUint8(p)
              if (k + 1 < limit) {
                value += ','
              }
              p += 1
            }
          }
          if (Btype === 'f') {
            for (let k = 0; k < limit; k++) {
              value += this.dv.getFloat32(p, true)
              if (k + 1 < limit) {
                value += ','
              }
              p += 4
            }
          }
          break
        }
        default: {
          console.warn(`Unknown BAM tag type '${type}', tags may be incomplete`)
          value = undefined
          p = blockEnd
        } // stop parsing tags
      }

      this._tagOffset = p

      this._tagList.push(tag)
      if (lcTag === tagName) {
        return value
      }

      this.data[lcTag] = value
    }
    this._allTagsParsed = true
    return
  }

  _parseAllTags() {
    this._parseTag('')
  }

  _parseCigar(cigar: string) {
    return (
      //@ts-expect-error
      cigar
        .match(/\d+\D/g)
        //@ts-expect-error
        .map(op => [op.match(/\D/)[0].toUpperCase(), Number.parseInt(op, 10)])
    )
  }

  /**
   * @returns {boolean} true if the read is paired, regardless of whether both segments are mapped
   */
  isPaired() {
    return !!(this.flags & Constants.BAM_FPAIRED)
  }

  /** @returns {boolean} true if the read is paired, and both segments are mapped */
  isProperlyPaired() {
    return !!(this.flags & Constants.BAM_FPROPER_PAIR)
  }

  /** @returns {boolean} true if the read itself is unmapped; conflictive with isProperlyPaired */
  isSegmentUnmapped() {
    return !!(this.flags & Constants.BAM_FUNMAP)
  }

  /** @returns {boolean} true if the read itself is unmapped; conflictive with isProperlyPaired */
  isMateUnmapped() {
    return !!(this.flags & Constants.BAM_FMUNMAP)
  }

  /** @returns {boolean} true if the read is mapped to the reverse strand */
  isReverseComplemented() {
    return !!(this.flags & Constants.BAM_FREVERSE)
  }

  /** @returns {boolean} true if the mate is mapped to the reverse strand */
  isMateReverseComplemented() {
    return !!(this.flags & Constants.BAM_FMREVERSE)
  }

  /** @returns {boolean} true if this is read number 1 in a pair */
  isRead1() {
    return !!(this.flags & Constants.BAM_FREAD1)
  }

  /** @returns {boolean} true if this is read number 2 in a pair */
  isRead2() {
    return !!(this.flags & Constants.BAM_FREAD2)
  }

  /** @returns {boolean} true if this is a secondary alignment */
  isSecondary() {
    return !!(this.flags & Constants.BAM_FSECONDARY)
  }

  /** @returns {boolean} true if this read has failed QC checks */
  isFailedQc() {
    return !!(this.flags & Constants.BAM_FQCFAIL)
  }

  /** @returns {boolean} true if the read is an optical or PCR duplicate */
  isDuplicate() {
    return !!(this.flags & Constants.BAM_FDUP)
  }

  /** @returns {boolean} true if this is a supplementary alignment */
  isSupplementary() {
    return !!(this.flags & Constants.BAM_FSUPPLEMENTARY)
  }

  cigar() {
    if (this.isSegmentUnmapped()) {
      return
    }

    const { byteArray, start } = this.bytes
    const numCigarOps = this.get('_n_cigar_op')
    let p = start + 36 + this.get('_l_read_name')
    const seqLen = this.get('seq_length')
    let cigar = ''
    let lref = 0

    // check for CG tag by inspecting whether the CIGAR field
    // contains a clip that consumes entire seqLen
    let cigop = this.dv.getInt32(p, true)
    let lop = cigop >> 4
    let op = CIGAR_DECODER[cigop & 0xf]
    if (op === 'S' && lop === seqLen) {
      // if there is a CG the second CIGAR field will
      // be a N tag the represents the length on ref
      p += 4
      cigop = this.dv.getInt32(p, true)
      lop = cigop >> 4
      op = CIGAR_DECODER[cigop & 0xf]
      if (op !== 'N') {
        console.warn('CG tag with no N tag')
      }
      this.data.length_on_ref = lop
      return this.get('CG')
    } else {
      for (let c = 0; c < numCigarOps; ++c) {
        cigop = this.dv.getInt32(p, true)
        lop = cigop >> 4
        op = CIGAR_DECODER[cigop & 0xf]
        cigar += lop + op

        // soft clip, hard clip, and insertion don't count toward
        // the length on the reference
        if (op !== 'H' && op !== 'S' && op !== 'I') {
          lref += lop
        }

        p += 4
      }

      this.data.length_on_ref = lref
      return cigar
    }
  }

  _flags() {}

  length_on_ref() {
    if (this.data.length_on_ref) {
      return this.data.length_on_ref
    } else {
      this.get('cigar') // the length_on_ref is set as a side effect
      return this.data.length_on_ref
    }
  }

  _n_cigar_op() {
    return this.get('_flag_nc') & 0xffff
  }

  _l_read_name() {
    return this.get('_bin_mq_nl') & 0xff
  }

  /**
   * number of bytes in the sequence field
   */
  _seq_bytes() {
    return (this.get('seq_length') + 1) >> 1
  }

  getReadBases() {
    return this.seq()
  }

  seq() {
    const { byteArray, start } = this.bytes
    const p =
      start + 36 + this.get('_l_read_name') + this.get('_n_cigar_op') * 4
    const seqBytes = this.get('_seq_bytes')
    const len = this.get('seq_length')
    let buf = ''
    let i = 0
    for (let j = 0; j < seqBytes; ++j) {
      const sb = byteArray[p + j]
      buf += SEQRET_DECODER[(sb & 0xf0) >> 4]
      i++
      if (i < len) {
        buf += SEQRET_DECODER[sb & 0x0f]
        i++
      }
    }
    return buf
  }

  // adapted from igv.js
  getPairOrientation() {
    if (
      !this.isSegmentUnmapped() &&
      !this.isMateUnmapped() &&
      this._refID === this._next_refid()
    ) {
      const s1 = this.isReverseComplemented() ? 'R' : 'F'
      const s2 = this.isMateReverseComplemented() ? 'R' : 'F'
      let o1 = ' '
      let o2 = ' '
      if (this.isRead1()) {
        o1 = '1'
        o2 = '2'
      } else if (this.isRead2()) {
        o1 = '2'
        o2 = '1'
      }

      const tmp = []
      const isize = this.template_length()
      if (isize > 0) {
        tmp[0] = s1
        tmp[1] = o1
        tmp[2] = s2
        tmp[3] = o2
      } else {
        tmp[2] = s1
        tmp[3] = o1
        tmp[0] = s2
        tmp[1] = o2
      }
      return tmp.join('')
    }
    return ''
  }

  _bin_mq_nl() {
    return this.dv.getInt32(this.bytes.start + 12, true)
  }

  _flag_nc() {
    return this.dv.getInt32(this.bytes.start + 16, true)
  }

  seq_length() {
    return this.dv.getInt32(this.bytes.start + 20, true)
  }

  _next_refid() {
    return this.dv.getInt32(this.bytes.start + 24, true)
  }

  _next_pos() {
    return this.dv.getInt32(this.bytes.start + 28, true)
  }

  template_length() {
    return this.dv.getInt32(this.bytes.start + 32, true)
  }

  toJSON() {
    const data: { [key: string]: any } = {}
    for (const k of Object.keys(this)) {
      if (k.charAt(0) === '_' || k === 'bytes') {
        continue
      }
      //@ts-expect-error
      data[k] = this[k]
    }

    return data
  }
}
