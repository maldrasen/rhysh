global.Template = (function() {

  function load(path) {
    try {
      return fs.readFileSync(`${ROOT}/${path}`, 'utf8');
    } catch(error) {
      console.error(`Template Error : ${path}`);
      console.error(error);
      return "[ERROR]"
    }
  }

  return {
    load: load,
  };

})();
