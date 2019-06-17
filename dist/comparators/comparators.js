"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const comparators = require("./comparator");
class Comparators {
    constructor(availableComparators = [comparators.DateComparator, comparators.NumberComparator]) {
        this.availableComparators = availableComparators;
    }
    compare(values, order) {
        const comparator = this.findComparator(values);
        if (comparator === undefined) {
            throw new Error(`Could not find comparator for ${values}.`);
        }
        return comparator.compare(values, order);
    }
    findComparator(values) {
        return this.availableComparators.find(comparator => comparator.isSatisfiedBy(values));
    }
    addComparator(comparator) {
        this.availableComparators.push(comparator);
    }
}
exports.create = () => new Comparators();
