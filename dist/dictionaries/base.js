"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class BaseDictionary {
    constructor(name, values) {
        this.name = name;
        this.values = values;
    }
    isSatisfiedBy(name) {
        return this.name === name;
    }
    getMappedValue(key) {
        return this.values[key];
    }
}
exports.default = BaseDictionary;
