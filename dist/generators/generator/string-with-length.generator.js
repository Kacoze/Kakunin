"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringWithLengthGenerator = {
    isSatisfiedBy(name) {
        return name === 'stringWithLength';
    },
    generate(generatorParam) {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        const length = parseInt(generatorParam);
        let result = '';
        for (let i = length; i > 0; i--) {
            result += chars[Math.floor(Math.random() * chars.length)];
        }
        return Promise.resolve(result);
    },
};
