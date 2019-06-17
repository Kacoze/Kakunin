"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class VariableStore {
    constructor(variables = []) {
        this.variables = variables;
    }
    storeVariable(name, value) {
        const foundVariable = this.variables.find(variable => variable.name === name);
        if (typeof foundVariable !== 'undefined') {
            throw new Error(`Variable ${name} is stored already`);
        }
        this.variables.push({ name, value });
    }
    updateVariable(name, value) {
        const foundVariable = this.variables.find(variable => variable.name === name);
        if (typeof foundVariable === 'undefined') {
            throw new Error(`Variable ${name} does not exist.`);
        }
        this.variables.push({ name, value });
    }
    getVariableValue(name) {
        const foundVariable = this.variables.find(variable => variable.name === name);
        if (typeof foundVariable === 'undefined') {
            throw new Error(`Variable ${name} was not stored`);
        }
        return foundVariable.value;
    }
    isStored(name) {
        const foundVariable = this.variables.find(variable => variable.name === name);
        return typeof foundVariable !== 'undefined';
    }
    clearVariables() {
        this.variables = [];
    }
    replaceTextVariables(text) {
        let newText = text;
        const variableNames = this.variables.map(variable => variable.name);
        for (const variableNameIndex in variableNames) {
            if (variableNames.hasOwnProperty(variableNameIndex)) {
                const variableName = variableNames[variableNameIndex];
                if (newText.indexOf(variableName) > -1) {
                    newText = text.replace(`v:${variableName}`, this.getVariableValue(variableName));
                    break;
                }
            }
        }
        return newText;
    }
}
exports.VariableStore = VariableStore;
exports.default = new VariableStore();
