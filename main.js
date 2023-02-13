const { app } = require('electron')

global.ROOT = require('path').normalize(`${__dirname}`).replace(/\\/g,"/");
global.DATA = app.getPath("userData")
global.VERSION = "0.1";

// We first boot Rhysh by loading all of the JavaScript objects into memory. My style of doing things is odd by modern
// standards I know. I really just prefer to put all the "classes" into the global scope that way they can be accessed
// from anywhere without requiring things. Tree Shaking really only makes sense for web pages where only a small
// percentage of your code is applicable on any given page. This is a game though, and a single page web app on top of
// that. There no reason not to have all the logic loaded at once.
require(`${ROOT}/engine/boot.js`);

// Once all the JavaScripts are loaded we open the webview to the client. It will do its boot process and send a
// message back to the server once it's ready. At that point we finish the boot process by loading all the data files.
Messenger.publish('server.start');
