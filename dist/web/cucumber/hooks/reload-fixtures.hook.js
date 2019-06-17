"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const cucumber_1 = require("cucumber");
const chalk_1 = require("chalk");
const parameters_1 = require("../../parameters");
const fixtures_loader_helper_1 = require("../../fixtures/fixtures-loader.helper");
const logRequestTime = timeStart => {
    const timeDiff = process.hrtime(timeStart);
    console.log(chalk_1.default.black.bgYellow('Request took ' + (timeDiff[0] + timeDiff[1] / 1000000000) + ' seconds'));
};
class ReloadFixturesHook {
    initializeHook() {
        cucumber_1.Before('@reloadFixtures', (scenario, callback) => {
            console.log(chalk_1.default.black.bgYellow('Reloading fixtures'));
            const timeStart = process.hrtime();
            fixtures_loader_helper_1.default
                .reloadFixtures(parameters_1.default.getReloadFixturesEndpoint())
                .then(response => {
                if (response.status === 200) {
                    console.log(chalk_1.default.black.bgGreen('Fixtures reloaded'));
                }
                else {
                    console.log(chalk_1.default.black.bgRed('There was a problem with fixtures reloading. The response is: '), response);
                }
                logRequestTime(timeStart);
                callback();
            })
                .catch(error => {
                console.log(chalk_1.default.black.bgRed('An error occurred during fixtures reloading: '), error);
                logRequestTime(timeStart);
                callback();
            });
        });
    }
    getPriority() {
        return 2;
    }
}
exports.reloadFixturesHook = new ReloadFixturesHook();
