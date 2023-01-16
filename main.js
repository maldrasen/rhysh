
global.ROOT = require('path').normalize(`${__dirname}`).replace(/\\/g,"/");
global.fs = require('fs');
global.hash = require('object-hash');
global.util = require('util');
global.Sequelize = require('sequelize');

require(`${ROOT}/modules/boot/main.js`);

Messenger.publish('database.start');
Messenger.publish('server.start');
