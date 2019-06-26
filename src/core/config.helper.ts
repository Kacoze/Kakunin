const commandArgs = require('minimist')(process.argv.slice(2));
let config;

try {
  if (process.env.NODE_ENV === 'test') {
    config = {
      projectPath: process.cwd(),
      email: {
        config: {},
      },
    };
    console.log(process.cwd());
    config = require(`${process.cwd()}/kakunin.conf.js`);
    config.projectPath = process.cwd();
    config.performance = commandArgs.performance || false;
  }
} catch(error) {
  console.log(error);
}

config = (<any>global).config || config;

(<any>global).config = config;

export default config;
