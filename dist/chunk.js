"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// little class representing a chunk in the index
class Chunk {
    constructor(minv, maxv, bin, _fetchedSize) {
        this.minv = minv;
        this.maxv = maxv;
        this.bin = bin;
        this._fetchedSize = _fetchedSize;
    }
    toUniqueString() {
        return `${this.minv}..${this.maxv} (bin ${this.bin}, fetchedSize ${this.fetchedSize()})`;
    }
    toString() {
        return this.toUniqueString();
    }
    compareTo(b) {
        return (this.minv.compareTo(b.minv) ||
            this.maxv.compareTo(b.maxv) ||
            this.bin - b.bin);
    }
    fetchedSize() {
        if (this._fetchedSize !== undefined) {
            return this._fetchedSize;
        }
        return this.maxv.blockPosition + (1 << 16) - this.minv.blockPosition;
    }
}
exports.default = Chunk;
//# sourceMappingURL=chunk.js.map