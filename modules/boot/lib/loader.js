global.Loader = (function() {
  let _initFunctions = [];

  function loadModule(mod) {
    const moduleRoot = `${ROOT}/modules/${mod}`;
    const orderFile = `${moduleRoot}/load-order.json`;

    console.log(`- Loading ${mod} module`);

    // When we load a module we just recursivly grab all the js files and load
    // them alphabetically. Some files will be dependent on other files though
    // so when that's the case we can specify that a file should be loaded
    // before another in a load-order.json file. Right now, a load order just
    // has a first option:
    //   { first:['lib/dicks/horse.js'] }
    if (fs.existsSync(orderFile)) {
      require(orderFile).first.forEach(file => {
        require(`${moduleRoot}/${file}`);
      });
    }

    loadDirectory(`${moduleRoot}/lib`);
    loadDirectory(`${moduleRoot}/data`);
    loadFile(`${moduleRoot}/init.js`);
  }

  function loadFile(path) {
    if (fs.existsSync(path)) { require(path); }
  }

  function loadDirectory(path) {
    if (fs.existsSync(path)) {
      fs.readdirSync(path, { withFileTypes:true }).forEach(item => {
        if (item.isFile() && item.name.match(/\.js$/)) {
          require(`${path}/${item.name}`);
        }
        if (item.isDirectory()) {
          loadDirectory(`${path}/${item.name}`);
        }
      })
    }
  }

  return {
    loadDirectory,
    loadModule,
  };

})();
