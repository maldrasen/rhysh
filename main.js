const { app } = require('electron')

global.ROOT = require('path').normalize(`${__dirname}`).replace(/\\/g,"/");
global.DATA = app.getPath("userData")

require(`${ROOT}/modules/boot/main.js`);

Messenger.publish('database.start');
Messenger.publish('server.start');
