global.fs = require('fs');
global.hash = require('object-hash');
global.util = require('util');

require(`${ROOT}/engine/environment`);
require(`${ROOT}/engine/loader`);
require(`${ROOT}/engine/settings`);

(function() {
  console.log('=== Booting Main Process ===')

  try {
    Environment.init();
    Settings.init();
    Loader.load();
    Switchboard.init();
  } catch(e) {
    console.error("\n!!! Error Booting Main Process !!!\n");
    console.error(e);
    process.exit(1)
  }

})();

global.log = function(message) {
  if (Environment.verbose) { console.log(message) }
}
