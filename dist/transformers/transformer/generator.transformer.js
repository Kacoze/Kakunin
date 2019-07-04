"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generators_1 = require("../../generators");
class GeneratorTransformer {
    constructor(generator) {
        this.generator = generator;
    }
    isSatisfiedBy(prefix) {
        return prefix === 'g:';
    }
    transform(value) {
        const splittedValues = value.split(':');
        const generatorName = splittedValues[0];
        return this.generator.generate(generatorName, splittedValues.slice(1));
    }
}
exports.createGeneratorTransformer = (geners = generators_1.generators) => new GeneratorTransformer(geners);
