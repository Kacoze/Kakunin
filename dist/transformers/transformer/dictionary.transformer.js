"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dictionaries_1 = require("../../dictionaries");
class DictionaryTransformer {
    constructor(dictionaries) {
        this.dictionaries = dictionaries;
    }
    isSatisfiedBy(prefix) {
        return prefix === 'd:';
    }
    transform(value) {
        const splittedValue = value.split(':');
        return this.dictionaries.getMappedValue(splittedValue[0], splittedValue[1]);
    }
}
exports.createDictionaryTransformer = (dictionaries = dictionaries_1.dictionaries) => new DictionaryTransformer(dictionaries);
