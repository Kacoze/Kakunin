"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Dictionaries {
    constructor(availableDictionaries = []) {
        this.availableDictionaries = availableDictionaries;
    }
    getMappedValue(dictionaryName, key) {
        const dic = this.findDictionary(dictionaryName);
        if (dic === undefined) {
            throw new Error(`Could not find dictionary for ${dictionaryName}.`);
        }
        return dic.getMappedValue(key);
    }
    findDictionary(name) {
        return this.availableDictionaries.find(dic => dic.isSatisfiedBy(name));
    }
    findMappedValueByPhrase(phrase) {
        const parameters = phrase.split(':');
        if (parameters[0] === 'd') {
            const dictionary = this.findDictionary(parameters[1]);
            if (dictionary) {
                return this.getMappedValue(parameters[1], parameters[2]);
            }
        }
        return phrase;
    }
    addDictionary(dictionary) {
        this.availableDictionaries.push(dictionary);
    }
}
exports.Dictionaries = Dictionaries;
exports.create = () => new Dictionaries();
