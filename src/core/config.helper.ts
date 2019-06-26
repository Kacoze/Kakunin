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
    const project = process.argv.find(name => name.indexOf('--projectPath') >= 0);
    const projectPath = project.substr(project.indexOf('=') + 1);
  
    config = require(`${process.cwd()}/kakunin.conf.js`);
    config.projectPath = projectPath;
    config.performance = commandArgs.performance || false;
  }
} catch(error) {
  console.log(error);
}

config = (<any>global).config || config;

(<any>global).config = config;

export default config;
