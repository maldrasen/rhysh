
global.ROOT = require('path').normalize(`${__dirname}`).replace(/\\/g,"/");

require(`${ROOT}/modules/boot/main.js`);

Messenger.publish('database.start');
Messenger.publish('server.start');
