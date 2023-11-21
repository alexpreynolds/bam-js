"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IndexFile {
    /**
     * @param {filehandle} filehandle
     * @param {function} [renameRefSeqs]
     */
    constructor({ filehandle, renameRefSeq = (n) => n, }) {
        this.filehandle = filehandle;
        this.renameRefSeq = renameRefSeq;
    }
}
exports.default = IndexFile;
//# sourceMappingURL=indexFile.js.map