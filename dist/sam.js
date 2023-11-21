"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseHeaderText = void 0;
function parseHeaderText(text) {
    const lines = text.split(/\r?\n/);
    const data = [];
    for (const line of lines) {
        const [tag, ...fields] = line.split(/\t/);
        if (tag) {
            data.push({
                tag: tag.slice(1),
                data: fields.map(f => {
                    const [fieldTag, value] = f.split(':', 2);
                    return { tag: fieldTag, value };
                }),
            });
        }
    }
    return data;
}
exports.parseHeaderText = parseHeaderText;
//# sourceMappingURL=sam.js.map