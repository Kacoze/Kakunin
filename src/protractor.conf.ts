require('./core/prototypes');
import * as jestExpect from 'expect';
import * as path from 'path';
import config from './core/config.helper';
import { prepareCatalogs } from './core/fs/prepare-catalogs.helper';
import { browsersConfiguration, setSeleniumAddress } from './web/browsers/browsers-config.helper';
import { getBrowsersDrivers } from './web/browsers/get-browser-drivers.helper';
import { connectBrowserstack, disconnectBrowserstack } from './web/browsers/browserstack-config.helper';
import { emailService } from './emails';
const XMLReporter = require('ruru-protractor-junit-reporter');
const commandArgs = require('minimist')(process.argv.slice(2));
const modulesLoader = require('./core/modules-loader.helper.js').create();

const reportsDirectory = path.join(process.cwd(), config.reports);
const jsonOutputDirectory = path.join(reportsDirectory, 'json-output-folder');
const generatedReportsDirectory = path.join(reportsDirectory, 'report');
const featureReportsDirectory = path.join(generatedReportsDirectory, 'features');
const performanceReportsDirectory = path.join(reportsDirectory, 'performance');

const prepareReportCatalogs = () => {
  prepareCatalogs(reportsDirectory);
  prepareCatalogs(jsonOutputDirectory);
  prepareCatalogs(generatedReportsDirectory);
  prepareCatalogs(featureReportsDirectory);
  prepareCatalogs(performanceReportsDirectory);
};

const configureMultiCapabilities = () => browsersConfiguration(config, commandArgs);

exports.config = {
  resultJsonOutputFile : `${jsonOutputDirectory}/forXML/e2e${config.tags}.json`,
  seleniumAddress: setSeleniumAddress(commandArgs, config),
  getMultiCapabilities: configureMultiCapabilities(),
  jvmArgs: getBrowsersDrivers(commandArgs),

  useAllAngular2AppRoots: config.type === 'ng2',

  getPageTimeout: parseInt(config.timeout) * 1000,
  allScriptsTimeout: parseInt(config.timeout) * 1000,

  framework: 'custom',
  frameworkPath: require.resolve('protractor-cucumber-framework'),
  specs: [],

  cucumberOpts: {
    require: [
      './web/cucumber/config.js',
      './step_definitions/**/*.js',
      './web/cucumber/hooks.js',
      ...config.step_definitions.map(file => path.join(config.projectPath, file, '**/*.js')),
    ],
    format: [`json:./${config.reports}/custom-json/${config.tags}.${config.branch || ''}.${config.runType}.json`],
    profile: false,
    'no-source': true,
  },

  // plugins: [
  //   {
  //     package: 'protractor-multiple-cucumber-html-reporter-plugin',
  //     options: {
  //       removeExistingJsonReportFile: false,
  //       removeOriginalJsonReportFile: false,
  //       automaticallyGenerateReport: false,
  //       saveCollectedJSON: false,
  //     },
  //   },
  // ],

  async beforeLaunch() {
    prepareReportCatalogs();

    if (commandArgs.browserstack) {
      await connectBrowserstack((await configureMultiCapabilities()())[0]['browserstack.key']);
    }
  },

  async afterLaunch() {
    await disconnectBrowserstack(commandArgs.browserstack);
    return new Promise((resolve) => {
 
      const reporter = new XMLReporter({
          title : `e2e${config.tags}`,
          xmlReportDestPath : `kakunin/reports/e2e${config.tags}Report.xml`
      });

      reporter.generateXMLReport(exports.config.resultJsonOutputFile);
    });
  },

  onPrepare() {
    if (!config.headless) {
      browser.driver
        .manage()
        .window()
        .setSize(parseInt(config.browserWidth), parseInt(config.browserHeight));
    }
    modulesLoader.getModules('matchers');
    modulesLoader.getModules('dictionaries');
    modulesLoader.getModules('generators');
    modulesLoader.getModules('comparators');
    modulesLoader.getModules('form_handlers');
    modulesLoader.getModules('transformers');
    modulesLoader.getModules('emails');
    modulesLoader.getModules('hooks');

    const modules = modulesLoader.getModulesAsObject(config.pages.map(page => path.join(config.projectPath, page)));

    browser.page = Object.keys(modules).reduce(
      (pages, moduleName) => ({ ...pages, [moduleName]: new modules[moduleName]() }),
      {}
    );

    global.expect = jestExpect;

    if (config.clearEmailInboxBeforeTests) {
      return emailService.clearInbox();
    }
  },

  baseUrl: config.baseUrl,
};
