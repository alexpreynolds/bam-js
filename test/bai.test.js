import { BAI, BamFile } from '../src'

import { LocalFile } from 'generic-filehandle'
import FakeRecord from './fakerecord'

class HalfAbortController {
  constructor() {
    this.signal = { aborted: false }
  }

  abort() {
    this.signal.aborted = true
  }
}

describe('index formats', () => {
  it('loads volvox-sorted.bam.bai', async () => {
    const ti = new BAI({
      filehandle: new LocalFile(require.resolve('./data/volvox-sorted.bam.bai')),
    })
    const indexData = await ti.parse()
    expect(indexData.bai).toEqual(true)
    expect(await ti.lineCount(0)).toEqual(9596)
    expect(await ti.hasRefSeq(0)).toEqual(true)
  })
  it('loads volvox-sorted.bam in similar test', async () => {
    const ti = new BamFile({
      bamPath: require.resolve('./data/volvox-sorted.bam'),
    })
    await ti.getHeader()
    expect(await ti.lineCount('ctgA')).toEqual(9596)
    expect(await ti.hasRefSeq('ctgA')).toEqual(true)
  })
})

describe('index human data', () => {
  it('loads 1000 genomes bai', async () => {
    const ti = new BAI({
      filehandle: new LocalFile(
        require.resolve('./data/HG00096.chrom20.ILLUMINA.bwa.GBR.low_coverage.20120522.bam.bai'),
      ),
    })
    const indexData = await ti.parse()
    expect(indexData.bai).toEqual(true)
    expect(await ti.hasRefSeq(19)).toEqual(true)
    expect(await ti.lineCount(19)).toEqual(2924253)
  })
  it('can abort loading 1000 genomes bai', async () => {
    const ti = new BAI({
      filehandle: new LocalFile(
        require.resolve('./data/HG00096.chrom20.ILLUMINA.bwa.GBR.low_coverage.20120522.bam.bai'),
      ),
    })
    const aborter = new HalfAbortController()
    const indexDataP = ti.parse(aborter.signal)
    aborter.abort()
    await expect(indexDataP).rejects.toThrow(/aborted/)
  })
})
describe('bam header', () => {
  it('loads volvox-sorted.bam', async () => {
    const ti = new BamFile({
      bamPath: require.resolve('./data/volvox-sorted.bam'),
    })
    await ti.getHeader()
    expect(ti.header).toEqual('@SQ	SN:ctgA	LN:50001\n')
    expect(ti.chrToIndex.ctgA).toEqual(0)
    expect(ti.indexToChr[0]).toEqual({ refName: 'ctgA', length: 50001 })
    const ret = await ti.indexCov('ctgA')
    expect(ret).toMatchSnapshot()
  })
  it('loads volvox-sorted.bam with csi index', async () => {
    const ti = new BamFile({
      bamPath: require.resolve('./data/volvox-sorted.bam'),
      csiPath: require.resolve('./data/volvox-sorted.bam.csi'),
    })
    await ti.getHeader()
    expect(ti.header).toEqual('@SQ	SN:ctgA	LN:50001\n')
    expect(ti.chrToIndex.ctgA).toEqual(0)
    expect(ti.indexToChr[0]).toEqual({ refName: 'ctgA', length: 50001 })
  })
})

describe('bam records', () => {
  let ti
  beforeEach(() => {
    ti = new BamFile({
      bamPath: require.resolve('./data/volvox-sorted.bam'),
    })
    return ti.getHeader()
  })
  it('gets features from volvox-sorted.bam', async () => {
    const records = await ti.getRecordsForRange('ctgA', 0, 1000)
    expect(records.length).toEqual(131)
    expect(records[0].get('start')).toEqual(2)
    expect(records[0].get('end')).toEqual(102)
    expect(records[0].get('cigar')).toEqual('100M')
    expect(records[0].get('name')).toEqual('ctgA_3_555_0:0:0_2:0:0_102d')
    expect(records[0].get('qual')).toEqual(
      '17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17 17',
    )
    expect(records[0].get('md')).toEqual('100')
    expect(records[0].getReadBases()).toEqual(
      'TTGTTGCGGAGTTGAACAACGGCATTAGGAACACTTCCGTCTCTCACTTTTATACGATTATGATTGGTTCTTTAGCCTTGGTTTAGATTGGTAGTAGTAG',
    )
  })
  it('gets features from the end of volvox-sorted.bam', async () => {
    const records = await ti.getRecordsForRange('ctgA', 47457, 50001)
    expect(records.length).toEqual(473)
  })
  it('gets out of bounds from volvox-sorted.bam', async () => {
    const records = await ti.getRecordsForRange('ctgA', 60000, 70000)
    expect(records.length).toEqual(0)
  })
  it('gets large chunk from volvox-sorted.bam', async () => {
    const promises = []
    const win = 1000
    for (let i = 0; i < 50000; i += win) {
      const records = ti.getRecordsForRange('ctgA', i, i + win)
      promises.push(records)
    }
    const recs = await Promise.all(promises)
    expect(recs.every(record => record.length > 0)).toBeTruthy()
  })

  it('gets specific weird chunk of volvox-sorted.bam', async () => {
    const records = await ti.getRecordsForRange('ctgA', 32749, 32799)
    expect(records.length).toEqual(13)
  })
  it('gets specific other weird chunk of volvox-sorted.bam', async () => {
    const records = await ti.getRecordsForRange('ctgA', 32799, 32849)
    expect(records.length).toEqual(11)
  })
})

describe('bam deep record check', () => {
  it('deep check volvox-sorted.bam', async () => {
    const ti = new BamFile({
      bamPath: require.resolve('./data/volvox-sorted.bam'),
    })
    await ti.getHeader()
    const records = await ti.getRecordsForRange('ctgA', 0, 10)
    expect(records).toMatchSnapshot()
  })
})

describe('1000 genomes bam check', () => {
  it('deep check 1000 genomes', async () => {
    const ti = new BamFile({
      bamPath: require.resolve('./data/1000genomes_hg00096_chr1.bam'),
      csiPath: require.resolve('./data/1000genomes_hg00096_chr1.bam.csi'),
    })
    await ti.getHeader()
    const records = await ti.getRecordsForRange('1', 0, 1000)
    expect(records).toMatchSnapshot()
  })
  it('deep check 1000 genomes bai', async () => {
    const ti = new BamFile({
      bamPath: require.resolve('./data/1000genomes_hg00096_chr1.bam'),
    })
    await ti.getHeader()
    const records = await ti.getRecordsForRange('1', 0, 1000)
    expect(records).toMatchSnapshot()
  })
  it('start to deep check 1000 genomes but abort instead', async () => {
    const aborter = new HalfAbortController()
    const ti = new BamFile({
      bamPath: require.resolve('./data/1000genomes_hg00096_chr1.bam'),
      csiPath: require.resolve('./data/1000genomes_hg00096_chr1.bam.csi'),
    })
    const recordsP = ti
      .getHeader(aborter.signal)
      .then(() => ti.getRecordsForRange('1', 0, 1000, { signal: aborter.signal }))
    aborter.abort()
    await expect(recordsP).rejects.toThrow(/aborted/)
  })
})

describe('ecoli bam check', () => {
  it('check ecoli header and records', async () => {
    const ti = new BamFile({
      bamPath: require.resolve('./data/ecoli_nanopore.bam'),
    })
    const header = await ti.getHeader()
    const records = await ti.getRecordsForRange('ref000001|chr', 0, 100)
    expect(header).toMatchSnapshot()
    expect(records).toMatchSnapshot()
  })
})
describe('BamFile with test_deletion_2_0.snps.bwa_align.sorted.grouped.bam', () => {
  let b
  beforeEach(async () => {
    b = new BamFile({
      bamPath: 'test/data/test_deletion_2_0.snps.bwa_align.sorted.grouped.bam',
    })
    await b.getHeader()
  })

  it('constructs', () => {
    expect(b).toBeTruthy()
  })

  it('loads some data', async () => {
    const features = await b.getRecordsForRange('Chromosome', 17000, 18000)
    expect(features.length).toEqual(124)
    expect(features.every(feature => feature.get('seq_length') === feature.getReadBases().length)).toBeTruthy()
  })
})

describe('BamFile tiny', () => {
  it('loads some data', async () => {
    const b = new BamFile({
      bamPath: 'test/data/tiny.bam',
    })
    await b.getHeader()
    const features = await b.getRecordsForRange('22', 30000000, 30010000)
    expect(features.length).toEqual(2)
  })
})

describe('BamFile secondary', () => {
  it('checks secondary', async () => {
    const b = new BamFile({
      bamPath: 'test/data/secondary.bam',
    })
    await b.getHeader()
    const features = await b.getRecordsForRange('20', 10761157, 10761387)
    const dups = features.map(f => f.isDuplicate()).reduce((x, y) => x + y)
    expect(dups).toEqual(2)
  })
})
describe('BamFile empty', () => {
  it('loads but does not crash', async () => {
    const b = new BamFile({
      bamPath: 'test/data/empty.bam',
    })
    await b.getHeader()
    const features = await b.getRecordsForRange('22', 30000000, 30010000)
    expect(features.length).toEqual(0)
  })
})

describe('BamFile with B tags', () => {
  it('test B tags', async () => {
    const b = new BamFile({
      bamPath: 'test/data/Btag.bam',
    })
    await b.getHeader()

    const features = await b.getRecordsForRange('chr1', 980654, 981663)
    // ZC:B:i,364,359,1,0    ZD:B:f,0.01,0.02,0.03   ZE:B:c,0,1,2,3  ZK:B:s,45,46,47
    const ret = features[1].get('ZD').split(',')
    expect(features[1].get('ZC')).toEqual('364,359,1,0')
    expect(features[1].get('ZE')).toEqual('0,1,2,3')
    expect(features[1].get('ZK')).toEqual('45,46,47')
    expect(+ret[0]).toBeCloseTo(0.01)
    expect(+ret[1]).toBeCloseTo(0.02)
    expect(+ret[2]).toBeCloseTo(0.03)
    expect(features.length).toEqual(2)
  })
})

describe('BamFile with paired ends', () => {
  it('paired ends', async () => {
    const b = new BamFile({
      bamPath: 'test/data/paired.bam',
    })
    await b.getHeader()

    const features = await b.getRecordsForRange('20', 62500, 64500)
    const f = features[0]
    expect(f._next_refid()).toEqual(19)
    expect(f._next_pos()).toEqual(62352)
  })
  it('read as pairs', async () => {
    const b = new BamFile({
      bamPath: 'test/data/paired.bam',
    })
    const p = new BamFile({
      bamPath: 'test/data/paired-region.bam',
    })

    await b.getHeader()
    await p.getHeader()

    const features = await b.getRecordsForRange('20', 62500, 64500, {
      viewAsPairs: true,
    })
    const features2 = await p.getRecordsForRange('20', 0, 70000)
    //    expect(features.length).toEqual(features2.length)
    expect(features.map(f => f.get('name')).sort()).toEqual(features2.map(f => f.get('name')).sort())
    const f = features[features.length - 1]
    const f2 = features2[features2.length - 1]
    expect(f.get('start')).toEqual(f2.get('start'))
  })
})

describe('BamFile+CSI with large coordinates', () => {
  it('use csi', async () => {
    const b = new BamFile({
      bamPath: 'test/data/large_coords.bam',
      csiPath: 'test/data/large_coords.bam.csi',
    })
    await b.getHeader()

    const features = await b.getRecordsForRange('ctgA', 1073741824, 1073741824 + 50000)
    expect(features.length).toEqual(9596)
  })
})

describe('Pair orientations', () => {
  it('test pair orientations', async () => {
    const b1 = new FakeRecord(true, 'F', 'F', 100)
    const b2 = new FakeRecord(true, 'F', 'R', 100)
    const b3 = new FakeRecord(true, 'R', 'R', 100)
    const b4 = new FakeRecord(true, 'R', 'F', 100)
    const b5 = new FakeRecord(false, 'F', 'F', 100)
    const b6 = new FakeRecord(false, 'F', 'R', 100)
    const b7 = new FakeRecord(false, 'R', 'R', 100)
    const b8 = new FakeRecord(false, 'R', 'F', 100)
    const b9 = new FakeRecord(false, 'F', 'F', -100)
    const b10 = new FakeRecord(false, 'F', 'R', -100)
    const b11 = new FakeRecord(false, 'R', 'R', -100)
    const b12 = new FakeRecord(false, 'R', 'F', -100)
    expect(b1.getPairOrientation()).toEqual('F1F2')
    expect(b2.getPairOrientation()).toEqual('F1R2')
    expect(b3.getPairOrientation()).toEqual('R1R2')
    expect(b4.getPairOrientation()).toEqual('R1F2')
    expect(b5.getPairOrientation()).toEqual('F2F1')
    expect(b6.getPairOrientation()).toEqual('F2R1')
    expect(b7.getPairOrientation()).toEqual('R2R1')
    expect(b8.getPairOrientation()).toEqual('R2F1')
    expect(b9.getPairOrientation()).toEqual('F1F2')
    expect(b10.getPairOrientation()).toEqual('R1F2')
    expect(b11.getPairOrientation()).toEqual('R1R2')
    expect(b12.getPairOrientation()).toEqual('F1R2')
  })
})

describe('SAM spec pdf', () => {
  it('check parse', async () => {
    const b = new BamFile({
      bamPath: 'test/data/samspec.bam',
      baiPath: 'test/data/samspec.bam.bai',
    })
    await b.getHeader()

    const features = await b.getRecordsForRange('ref', 1, 100)
    expect(features.length).toEqual(6)
    expect(features[2].get('sa')).toEqual('ref,29,-,6H5M,17,0;')
    expect(features[4].get('sa')).toEqual('ref,9,+,5S6M,30,1;')
  })
})
describe('trigger range out of bounds file', () => {
  it('range error', async () => {
    const b = new BamFile({
      bamPath: 'test/data/cho.bam',
    })
    await b.getHeader()
    expect(Object.keys(b.chrToIndex).length).toEqual(28751)
  })
})

describe('test too large of genome coordinates', () => {
  it('test error', async () => {
    const ti = new BAI({
      filehandle: new LocalFile(require.resolve('./data/needs_csi.bai')),
    })
    await expect(ti.parse()).rejects.toThrow(/too many bins/)
  })
})

describe('large indexcov', () => {
  it('human 1000g', async () => {
    const ti = new BAI({
      filehandle: new LocalFile(require.resolve('./data/HG00096_illumina_lowcov.bam.bai')),
    })
    const ret = await ti.indexCov(10, 0, 1000000)
    expect(ret).toMatchSnapshot()
    const empty = await ti.indexCov(0)
    expect(empty).toEqual([])
  })
})

test('unique id for duplicate features', async () => {
  const ti = new BamFile({
    bamPath: require.resolve('./data/exact_duplicate.bam'),
  })
  await ti.getHeader()
  const ret = await ti.getRecordsForRange('ctgA', 0, 1000)
  expect(ret[0].id() !== ret[1].id()).toBeTruthy()
})

test('usage of the chr22 ultralong nanopore', async () => {
  const ti = new BamFile({
    bamPath: require.resolve('./data/chr22_nanopore_subset.bam'),
  })
  await ti.getHeader()
  const ret1 = await ti.getRecordsForRange('22', 16559999, 16564499)
  const ret2 = await ti.getRecordsForRange('22', 16564499, 16564999)
  const findfeat = k => k.get('name') === '3d509937-5c54-46d7-8dec-c49c7165d2d5'
  const [r1, r2] = [ret1, ret2].map(x => x.find(findfeat))
  expect(r1.id()).toEqual(r2.id())
})

test('pair across chrom', async () => {
  const ti = new BamFile({
    bamPath: require.resolve('./data/pair_across_chr.bam'),
  })
  await ti.getHeader()
  const ret1 = await ti.getRecordsForRange('1', 0, 272213638, {
    viewAsPairs: true,
    pairAcrossChr: true,
  })
  expect(ret1.length).toBe(2)
})

test('fetch chimeras across chromosomes', async () => {
  const ti = new BamFile({
    bamPath: require.resolve('./data/cross_chr_chimera_samspec.bam'),
  })
  await ti.getHeader()
  const ret1 = await ti.getRecordsForRange('ref1', 0, 10000, { viewAsChimeras: true })
  expect(ret1.length).toBe(2)
  expect(ret1).toMatchSnapshot()
})

test('fetch chimeras in the samspec file', async () => {
  const ti = new BamFile({
    bamPath: require.resolve('./data/samspec.bam'),
  })
  await ti.getHeader()
  const ret1 = await ti.getRecordsForRange('ref', 0, 10000, { viewAsChimeras: true })
  const c = ret1.filter(f => f.isChimeric()).map(f => f.name())
  expect(c).toMatchSnapshot()
  expect(ret1.length).toBe(8)
})
