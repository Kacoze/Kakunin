"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chalk_1 = require("chalk");
const cucumber_1 = require("cucumber");
const config_helper_1 = require("../core/config.helper");
const time_to_first_byte_analyser_helper_1 = require("../web/performance/time-to-first-byte-analyser.helper");
const fs = require("fs");
const browsermob_proxy_1 = require("browsermob-proxy");
const analyser = time_to_first_byte_analyser_helper_1.create();
let proxy;
cucumber_1.When(/^I start performance monitor mode$/, () => {
    proxy = new browsermob_proxy_1.Proxy({
        port: config_helper_1.default.browserMob.serverPort,
    });
    let proxyReady = false;
    proxy.start(config_helper_1.default.browserMob.port, err => {
        if (!err) {
            proxy.startHAR(config_helper_1.default.browserMob.port, 'test', true, true, () => {
                proxyReady = true;
            });
        }
        else {
            console.error(err);
        }
    });
    browser.driver.wait(() => {
        return proxyReady;
    });
});
cucumber_1.When(/^I save performance report file as "([^"]*)"$/, function (fileName) {
    const uniqueFileName = `${fileName}-${Date.now()}.har`;
    let proxyDone = false;
    proxy.getHAR(config_helper_1.default.browserMob.port, (err, resp) => {
        if (!err) {
            console.log(`har saved at ${uniqueFileName}`);
            fs.writeFileSync(`reports/performance/${uniqueFileName}`, resp, 'utf8');
        }
        else {
            console.err('Error getting HAR file: ' + err);
        }
        proxy.stop(config_helper_1.default.browserMob.port, () => {
            proxyDone = true;
        });
    });
    return browser.driver.wait(() => {
        this.performanceReportFile = uniqueFileName;
        return proxyDone;
    });
});
cucumber_1.Then(/^the requests should take a maximum of "([^"]*)" milliseconds$/, function (maxTiming) {
    try {
        const slowRequests = analyser.checkTiming(this.performanceReportFile, parseFloat(maxTiming));
        if (slowRequests.length > 0) {
            slowRequests.forEach(({ url, ttfb }) => {
                console.log(chalk_1.default.white.bgRed('\r\n', 'Slow request:', '\r\n', `URL: ${url}`, '\r\n', `TTFB: ${ttfb.toFixed(2)} ms`, '\r\n'));
            });
            return Promise.reject('TTFB value is too big! Details available above.');
        }
        return Promise.resolve();
    }
    catch (err) {
        return Promise.reject(err);
    }
});
