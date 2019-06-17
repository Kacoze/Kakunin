"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const config_helper_1 = require("../../core/config.helper");
const cucumber_1 = require("cucumber");
cucumber_1.setDefaultTimeout(Number(config_helper_1.default.timeout) * 1000);
