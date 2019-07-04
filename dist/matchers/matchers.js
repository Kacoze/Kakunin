"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const matchers = require("./matcher");
exports.separator = ':';
class Matchers {
    constructor(availableMatchers = [
        matchers.regexMatcher,
        matchers.clickableMatcher,
        matchers.invisibleMatcher,
        matchers.notClickableMatcher,
        matchers.presentMatcher,
        matchers.textMatcher,
        matchers.visibleMatcher,
        matchers.attributeMatcher,
        matchers.currentDateMatcher,
    ]) {
        this.availableMatchers = availableMatchers;
    }
    addMatcher(matcher) {
        this.availableMatchers.push(matcher);
    }
    match(element, matcherName) {
        const splittedValue = matcherName.split(exports.separator);
        const matcher = this.findMatcher(splittedValue[0], splittedValue[1]);
        if (matcher === undefined) {
            throw new Error(`Could not find matcher for ${matcherName}.`);
        }
        return matcher.match(element, ...splittedValue.slice(1));
    }
    findMatcher(prefix, param) {
        return this.availableMatchers.find(matcher => matcher.isSatisfiedBy(prefix, param));
    }
}
exports.create = () => new Matchers();
