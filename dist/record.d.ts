/// <reference types="node" />
/**
 * Class of each BAM record returned by this API.
 */
export default class BamRecord {
    private data;
    private bytes;
    private flags;
    private _id;
    private _refID;
    private _tagOffset;
    private _tagList;
    private _allTagsParsed;
    constructor(args: any);
    get(field: string): any;
    end(): any;
    seq_id(): number;
    _get(field: string): any;
    _tags(): string[];
    parent(): undefined;
    children(): any;
    id(): number;
    /**
     * Mapping quality score.
     */
    mq(): number | undefined;
    score(): any;
    qual(): string | undefined;
    qualRaw(): Buffer | undefined;
    strand(): 1 | -1;
    multi_segment_next_segment_strand(): 1 | -1 | undefined;
    name(): any;
    _read_name(): any;
    /**
     * Get the value of a tag, parsing the tags as far as necessary.
     * Only called if we have not already parsed that field.
     */
    _parseTag(tagName?: string): any;
    _parseAllTags(): void;
    _parseCigar(cigar: string): (string | number)[][];
    /**
     * @returns {boolean} true if the read is paired, regardless of whether both segments are mapped
     */
    isPaired(): boolean;
    /** @returns {boolean} true if the read is paired, and both segments are mapped */
    isProperlyPaired(): boolean;
    /** @returns {boolean} true if the read itself is unmapped; conflictive with isProperlyPaired */
    isSegmentUnmapped(): boolean;
    /** @returns {boolean} true if the read itself is unmapped; conflictive with isProperlyPaired */
    isMateUnmapped(): boolean;
    /** @returns {boolean} true if the read is mapped to the reverse strand */
    isReverseComplemented(): boolean;
    /** @returns {boolean} true if the mate is mapped to the reverse strand */
    isMateReverseComplemented(): boolean;
    /** @returns {boolean} true if this is read number 1 in a pair */
    isRead1(): boolean;
    /** @returns {boolean} true if this is read number 2 in a pair */
    isRead2(): boolean;
    /** @returns {boolean} true if this is a secondary alignment */
    isSecondary(): boolean;
    /** @returns {boolean} true if this read has failed QC checks */
    isFailedQc(): boolean;
    /** @returns {boolean} true if the read is an optical or PCR duplicate */
    isDuplicate(): boolean;
    /** @returns {boolean} true if this is a supplementary alignment */
    isSupplementary(): boolean;
    cigar(): any;
    _flags(): void;
    length_on_ref(): any;
    _n_cigar_op(): number;
    _l_read_name(): number;
    /**
     * number of bytes in the sequence field
     */
    _seq_bytes(): number;
    getReadBases(): string;
    seq(): string;
    getPairOrientation(): string | null;
    _bin_mq_nl(): any;
    _flag_nc(): any;
    seq_length(): any;
    _next_refid(): any;
    _next_pos(): any;
    template_length(): any;
    toJSON(): {
        [key: string]: any;
    };
}
