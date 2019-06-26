const commandArgs = require('minimist')(process.argv.slice(2));
let config = require(`${process.cwd()}/kakunin.conf.js`);

console.log(config);

config = {
  projectPath: process.cwd(),
  email: {
    config: {},
  },
};
config.projectPath = process.cwd();
config.performance = commandArgs.performance || false;

export default config;
