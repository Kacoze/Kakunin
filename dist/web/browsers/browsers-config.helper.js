"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const glob = require("glob");
const path = require("path");
// import { createFirefoxProfile } from './create-firefox-profile.helper';
const safari_browser_configurator_helper_1 = require("./safari-browser-configurator.helper");
const prepare_browser_instance_specs_helper_1 = require("../parallel/prepare-browser-instance-specs.helper");
const chunk_specs_helper_1 = require("../parallel/chunk-specs.helper");
const getDefaultBrowsersConfigs = (config) => {
    const chromeConfig = {
        browserName: 'chrome',
        chromeOptions: {
            args: [],
            prefs: {
                credentials_enable_service: false,
                profile: {
                    password_manager_enabled: false,
                },
                download: {
                    prompt_for_download: false,
                    default_directory: config.projectPath + config.downloads,
                    directory_upgrade: true,
                },
            },
        },
    };
    const firefoxConfig = {
        browserName: 'firefox',
        marionette: true,
        'moz:firefoxOptions': {
            args: [],
        },
    };
    const safariConfig = {
        browserName: 'safari',
    };
    const ieConfig = {
        browserName: 'internet explorer',
    };
    return {
        chromeConfig,
        firefoxConfig,
        safariConfig,
        ieConfig,
    };
};
const getExtendedBrowsersConfigs = (config, commandArgs) => {
    const configs = getDefaultBrowsersConfigs(config);
    if (config.performance) {
        configs.chromeConfig.proxy = {
            proxyType: 'manual',
            httpProxy: `${config.browserMob.host}:${config.browserMob.port}`,
            sslProxy: `${config.browserMob.host}:${config.browserMob.port}`,
        };
    }
    if (config.noGpu) {
        configs.chromeConfig.chromeOptions.args = [
            ...configs.chromeConfig.chromeOptions.args,
            '--disable-gpu',
            '--disable-impl-side-painting',
            '--disable-gpu-sandbox',
            '--disable-accelerated-2d-canvas',
            '--disable-accelerated-jpeg-decoding',
            '--no-sandbox',
        ];
    }
    if (config.incognito) {
        configs.chromeConfig.chromeOptions.args = [
            ...configs.chromeConfig.chromeOptions.args,
            '--incognito'
        ];
    }
    if ((config.headless && commandArgs.headless === undefined) ||
        (commandArgs.headless && commandArgs.headless !== 'false')) {
        configs.chromeConfig.chromeOptions.args = [
            ...configs.chromeConfig.chromeOptions.args,
            '--headless',
            `--window-size=${config.browserWidth}x${config.browserHeight}`,
        ];
        configs.firefoxConfig['moz:firefoxOptions'].args = [
            ...configs.firefoxConfig['moz:firefoxOptions'].args,
            '-headless',
            `--window-size=${config.browserWidth}x${config.browserHeight}`,
        ];
    }
    return configs;
};
exports.browsersConfiguration = (config, commandArgs) => {
    return () => {
        const browsersSettings = [];
        const browserConfigs = getExtendedBrowsersConfigs(config, commandArgs);
        const allSpecs = glob.sync(config.features.map(file => path.join(config.projectPath, file, '**/*.feature'))[0]);
        const isParallel = commandArgs.parallel !== undefined && Number.isInteger(commandArgs.parallel) && commandArgs.parallel !== 0;
        const numberOfInstances = isParallel
            ? commandArgs.parallel >= allSpecs.length
                ? allSpecs.length
                : commandArgs.parallel
            : 1;
        const expectedArrayLength = Math.ceil(allSpecs.length / numberOfInstances);
        const chunkedSpecs = chunk_specs_helper_1.chunkSpecs(commandArgs, allSpecs, expectedArrayLength, numberOfInstances);
        if (allSpecs.length === 0) {
            throw new Error('Could not find any files matching regex in the directory!');
        }
        const pushPreparedBrowserInstance = browserType => {
            for (let i = 0; i < numberOfInstances; i++) {
                browsersSettings.push(prepare_browser_instance_specs_helper_1.prepareBrowserInstance(browserConfigs[browserType], chunkedSpecs[i]));
            }
        };
        if (commandArgs.browserstack) {
            return Promise.resolve([prepare_browser_instance_specs_helper_1.prepareBrowserInstance(config.browserstack.capabilities, allSpecs)]);
        }
        // if (commandArgs.firefox) {
        //   browserConfigs.firefoxConfig.firefox_profile = createFirefoxProfile(config);
        //   pushPreparedBrowserInstance('firefoxConfig');
        // }
        if (commandArgs.safari) {
            safari_browser_configurator_helper_1.safariBrowserConfigurator(config);
            pushPreparedBrowserInstance('safariConfig');
        }
        if (commandArgs.ie) {
            pushPreparedBrowserInstance('ieConfig');
        }
        if (commandArgs.chrome ||
            (commandArgs.firefox === undefined && commandArgs.safari === undefined && commandArgs.ie === undefined)) {
            pushPreparedBrowserInstance('chromeConfig');
        }
        return Promise.resolve(browsersSettings);
    };
};
exports.setSeleniumAddress = (commandArgs, config) => {
    return commandArgs.browserstack ? config.browserstack.seleniumAddress : '';
};
