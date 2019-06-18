const path = require('path');
const jest = require('jest-cli');
const exec = require('child_process').execFile;
const jestConfig = require('./jest.e2e.config.js');

const run = async () => {
  const projectRootPath = path.resolve(__dirname, 'src');


  const child = exec('node', [path.resolve(__dirname, './http-server.js')], {
    env: {
      PORT: process.env.PORT,
      detached: true
    }
  },(_, __, stderr) => {
    if (stderr != '') {
      console.error('stderr', stderr);
    }
  });

  console.log('running e2e tests...');

  const result = await jest.runCLI(jestConfig, [projectRootPath]);
  
  child.kill();
  
  if (result.results.success) {
    console.log(`E2E completed`);
    process.exit(0);
  } else {
    console.error(`E2E failed`);
    process.exit(1);
  }

}

run();
