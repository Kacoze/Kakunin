"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const defaultFilters = require("./filter");
class Filters {
    constructor() {
        this.availableFilters = [
            defaultFilters.currentUserFilter,
            defaultFilters.minimalEmailSizeFilter,
            defaultFilters.textFieldFilter,
        ];
    }
    filter(emails, type, value, world) {
        const filter = this.findFilter(type);
        if (typeof filter === 'undefined') {
            throw new Error(`Could not find filter for ${type}.`);
        }
        return filter.filter(emails, type, value, world);
    }
    findFilter(type) {
        return this.availableFilters.find(filter => filter.isSatisfiedBy(type));
    }
}
exports.filters = new Filters();
