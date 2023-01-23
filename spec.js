
global.expect = require('chai').expect;
global.ROOT = require('path').normalize(`${__dirname}`).replace(/\\/g,"/");
global.DATA = `${ROOT}/test`

require(`${ROOT}/engine/boot.js`);

before(() => {
  return new Promise(resolve => {
    Messenger.subscribe("database.ready", () => {
      console.log("=== Test Environment Loaded and Ready ===\n\n");
      resolve();
    });
  });
});

afterEach(() => {
  return new Promise(async resolve => {
    await Database.clear();
    // Flag.clear();
    resolve();
  });
});

global.SpecHelper = {

  print(message) {
    if (Environment.verbose) { console.log(`      ${message}`); }
  },

  tenTimes(done, testFunction) {
    let times = Environment.verbose ? 10 : 1
    let tests = [];

    for (let i=0; i<times; i++) {
      tests.push(new Promise(resolve => {
        testFunction(resolve);
      }));
    };

    Promise.all(tests).then(()=>{ done(); });
  },

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

};

Messenger.publish("database.start");
