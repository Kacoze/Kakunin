"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('./core/prototypes');
const jestExpect = require("expect");
const path = require("path");
const config_helper_1 = require("./core/config.helper");
const prepare_catalogs_helper_1 = require("./core/fs/prepare-catalogs.helper");
const browsers_config_helper_1 = require("./web/browsers/browsers-config.helper");
const get_browser_drivers_helper_1 = require("./web/browsers/get-browser-drivers.helper");
const browserstack_config_helper_1 = require("./web/browsers/browserstack-config.helper");
const emails_1 = require("./emails");
const XMLReporter = require('ruru-protractor-junit-reporter');
const commandArgs = require('minimist')(process.argv.slice(2));
const modulesLoader = require('./core/modules-loader.helper.js').create();
const reportsDirectory = path.join(process.cwd(), config_helper_1.default.reports);
const jsonOutputDirectory = path.join(reportsDirectory, '/../reports/', 'json-output-folder');
const generatedReportsDirectory = path.join(reportsDirectory, 'report');
const featureReportsDirectory = path.join(generatedReportsDirectory, 'features');
const performanceReportsDirectory = path.join(reportsDirectory, 'performance');
const prepareReportCatalogs = () => {
    prepare_catalogs_helper_1.prepareCatalogs(reportsDirectory);
    prepare_catalogs_helper_1.prepareCatalogs(jsonOutputDirectory);
    prepare_catalogs_helper_1.prepareCatalogs(generatedReportsDirectory);
    prepare_catalogs_helper_1.prepareCatalogs(featureReportsDirectory);
    prepare_catalogs_helper_1.prepareCatalogs(performanceReportsDirectory);
};
const configureMultiCapabilities = () => browsers_config_helper_1.browsersConfiguration(config_helper_1.default, commandArgs);
exports.config = {
    resultJsonOutputFile: `${jsonOutputDirectory}/forXML/e2e${config_helper_1.default.tags}.json`,
    seleniumAddress: browsers_config_helper_1.setSeleniumAddress(commandArgs, config_helper_1.default),
    getMultiCapabilities: configureMultiCapabilities(),
    jvmArgs: get_browser_drivers_helper_1.getBrowsersDrivers(commandArgs),
    useAllAngular2AppRoots: config_helper_1.default.type === 'ng2',
    getPageTimeout: parseInt(config_helper_1.default.timeout) * 1000,
    allScriptsTimeout: parseInt(config_helper_1.default.timeout) * 1000,
    framework: 'custom',
    frameworkPath: require.resolve('protractor-cucumber-framework'),
    specs: [],
    cucumberOpts: {
        require: [
            './web/cucumber/config.js',
            './step_definitions/**/*.js',
            './web/cucumber/hooks.js',
            ...config_helper_1.default.step_definitions.map(file => path.join(config_helper_1.default.projectPath, file, '**/*.js')),
        ],
        format: [`json:./${config_helper_1.default.reports}/custom-json/${config_helper_1.default.tags}-${config_helper_1.default.brand || ''}-features-report.json`],
        profile: false,
        'no-source': true,
    },
    plugins: [
        {
            package: 'protractor-multiple-cucumber-html-reporter-plugin',
            options: {
                removeExistingJsonReportFile: false,
                removeOriginalJsonReportFile: false,
                automaticallyGenerateReport: false,
                saveCollectedJSON: true,
            },
        },
    ],
    async beforeLaunch() {
        prepareReportCatalogs();
        if (commandArgs.browserstack) {
            await browserstack_config_helper_1.connectBrowserstack((await configureMultiCapabilities()())[0]['browserstack.key']);
        }
    },
    async afterLaunch() {
        await browserstack_config_helper_1.disconnectBrowserstack(commandArgs.browserstack);
        return new Promise((resolve) => {
            const reporter = new XMLReporter({
                title: `e2e${config_helper_1.default.tags}`,
                xmlReportDestPath: `e2e${config_helper_1.default.tags}Report.xml`
            });
            reporter.generateXMLReport(exports.config.resultJsonOutputFile);
        });
    },
    onPrepare() {
        if (!config_helper_1.default.headless) {
            browser.driver
                .manage()
                .window()
                .setSize(parseInt(config_helper_1.default.browserWidth), parseInt(config_helper_1.default.browserHeight));
        }
        modulesLoader.getModules('matchers');
        modulesLoader.getModules('dictionaries');
        modulesLoader.getModules('generators');
        modulesLoader.getModules('comparators');
        modulesLoader.getModules('form_handlers');
        modulesLoader.getModules('transformers');
        modulesLoader.getModules('emails');
        modulesLoader.getModules('hooks');
        const modules = modulesLoader.getModulesAsObject(config_helper_1.default.pages.map(page => path.join(config_helper_1.default.projectPath, page)));
        browser.page = Object.keys(modules).reduce((pages, moduleName) => ({ ...pages, [moduleName]: new modules[moduleName]() }), {});
        global.expect = jestExpect;
        if (config_helper_1.default.clearEmailInboxBeforeTests) {
            return emails_1.emailService.clearInbox();
        }
    },
    baseUrl: config_helper_1.default.baseUrl,
};
