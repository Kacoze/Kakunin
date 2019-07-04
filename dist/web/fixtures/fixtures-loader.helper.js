"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_fetch_1 = require("node-fetch");
const FixturesLoader = {
    reloadFixtures(endpoint) {
        return node_fetch_1.default(endpoint);
    },
};
exports.default = FixturesLoader;
