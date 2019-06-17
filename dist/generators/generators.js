"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const generators = require("./generator");
class Generators {
    constructor(availableGenerators = [generators.personalDataGenerator, generators.stringWithLengthGenerator]) {
        this.availableGenerators = availableGenerators;
    }
    generate(generatorName, ...params) {
        const gen = this.findGenerator(generatorName);
        if (gen === undefined) {
            throw new Error(`Could not find generator for ${generatorName}.`);
        }
        return gen.generate(...params);
    }
    addGenerator(generator) {
        this.availableGenerators.push(generator);
    }
    findGenerator(name) {
        return this.availableGenerators.find(gen => gen.isSatisfiedBy(name));
    }
}
exports.Generators = Generators;
exports.create = () => new Generators();
