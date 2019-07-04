"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dictionary_transformer_1 = require("./transformer/dictionary.transformer");
const generator_transformer_1 = require("./transformer/generator.transformer");
const variable_store_transformer_1 = require("./transformer/variable-store.transformer");
class Transformers {
    constructor(availableTransformers) {
        this.availableTransformers = availableTransformers;
    }
    transform(value) {
        const transformer = this.findTransformer(value.substr(0, 2));
        if (transformer === undefined) {
            return value;
        }
        return transformer.transform(value.substr(2));
    }
    findTransformer(prefix) {
        return this.availableTransformers.find(transformer => transformer.isSatisfiedBy(prefix));
    }
    addTransformer(transformer) {
        this.availableTransformers.push(transformer);
    }
}
const transformers = [variable_store_transformer_1.createVariableStoreTransformer(), dictionary_transformer_1.createDictionaryTransformer(), generator_transformer_1.createGeneratorTransformer()];
exports.create = (transf = transformers) => new Transformers(transf);
