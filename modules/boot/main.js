global.fs = require('fs');
global.hash = require('object-hash');
global.util = require('util');

// Requiring Sequalize somehow prevents the dev tools from opening.
// global.Sequelize = require('sequelize');

require(`${ROOT}/modules/boot/lib/environment`);
require(`${ROOT}/modules/boot/lib/loader`);
require(`${ROOT}/modules/boot/lib/settings`);

(function() {
  console.log('=== Booting Main Process ===')

  try {
    Environment.init();
    Settings.init();
    Loader.loadModule('core');
  } catch(e) {
    console.error("\n!!! Error Booting Main Process !!!\n");
    console.error(e);
    process.exit(1)
  }

})();

global.log = function(message) {
  if (Environment.verbose) { console.log(message) }
}
