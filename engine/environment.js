global.Environment = (function() {

  const PROD = {
    name: 'production',
    debug: false,
    verbose: false,
  };

  const DEV = {
    name: 'development',
    debug: true,
    verbose: true,
  };

  // The env.json file is really just used to switch between the development and production modes. The environment is
  // production by default, and becomes development only if the environment there is set to dev. I could have put the
  // environment options in the file, but that would make packaging and deploying more complex. Doing it this way I
  // only need to change or exclude that file to make a production build.
  function init() {
    let env = PROD;

    try {
      let data = JSON.parse(fs.readFileSync(`${ROOT}/env.json`));
      if (data.environment == "dev") {
        env = DEV;
        env.debugOptions = data.debugOptions;
      }
    } catch(error) {}

    global.Environment = env;
  }

  return { init }

})();
