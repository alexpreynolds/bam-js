const { Parser } = require('binary-parser')
const { BamMalformedError } = require('./errors')
const LocalFile = require('./localFile')

function addRecordToIndex(index, record) {
  if (record.some(el => el === undefined)) {
    throw new BamMalformedError('invalid .bai index file')
  }

  const [seqId, start, span, containerStart, sliceStart, sliceBytes] = record

  if (!index[seqId]) index[seqId] = []

  index[seqId].push({
    start,
    span,
    containerStart,
    sliceStart,
    sliceBytes,
  })
}
class BaiIndex {
   /**
   * @param {object} args
   * @param {string} [args.path]
   * @param {string} [args.url]
   * @param {FileHandle} [args.filehandle]
   */
  constructor({ baiFilehandle, baiPath }) {
    if (baiFilehandle) {
      this.bai = baiFilehandle
    } else if (baiPath) {
      this.bai = new LocalFile(baiPath)
    }
    this.readFile = this.bai.readFile.bind(this.bai)
    this.index = this.parseIndex()
  }

  async parseIndex() {
    const index = {}
    const data = await this.readFile()
    const parser = new Parser()
      .string('magic', { length: 4 })
      .int32('nref')
    const ret = parser.parse(data)
    console.log(ret)
  }

  getIndex() {
    return this.index
  }

  /**
   * @param {number} seqId
   * @returns {Promise} true if the index contains entries for
   * the given reference sequence ID, false otherwise
   */
  async hasDataForReferenceSequence(seqId) {
    return !!(await this.index)[seqId]
  }

  /**
   * fetch index entries for the given range
   *
   * @param {number} seqId
   * @param {number} queryStart
   * @param {number} queryEnd
   *
   * @returns {Promise} promise for
   * an array of objects of the form
   * `{start, span, containerStart, sliceStart, sliceBytes }`
   */
  async getEntriesForRange(seqId, queryStart, queryEnd) {
    const seqEntries = (await this.index)[seqId]
    if (!seqEntries) return []

  }
}

module.exports = BaiIndex
