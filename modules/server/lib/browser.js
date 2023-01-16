global.Browser = (function() {

  let mainWindow;

  function init() {
    app.on('ready', Browser.open);
    app.on('window-all-closed', Browser.quit);
    app.on('activate', Browser.activate);

    // Open new windows in the user's default browser.
    app.on('web-contents-created', (e, contents) => {
      contents.on('new-window', (e, url) => {
        e.preventDefault();
        electron.shell.openExternal(url);
      });
    });
  }

  function open() {
    mainWindow = new electron.BrowserWindow({
      width: (Environment.debug ? 1800 : 1200),
      height: (Environment.debug ? 1000 : 1000),
      webPreferences: { 
        preload: `${ROOT}/client/preload.js`
      },
    });

    mainWindow.loadURL(`file://${ROOT}/client/index.html`);

    if (Environment.debug) {
      mainWindow.webContents.openDevTools();
    }

    if (!Environment.debug) {
      mainWindow.setMenu(null);
    }

    mainWindow.on('closed', () => {
      mainWindow = null;
      quit();
    });
  }

  function activate() {
    if (mainWindow === null) { createWindow(); }
  }

  function quit() {
    app.quit();
  }

  function send(message, content) {
    mainWindow.webContents.send(message, content);
  }

  return { init, open, quit, activate, send };

})();
