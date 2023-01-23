const zlib = require('zlib');

global.Kompressor = (function() {

  function read(path) {
    return new Promise(resolve => {
      fs.readFile(path, (error, contents) => {
        if (error) { throw error; }

        zlib.inflate(contents, (error, inflated) => {
          if (error) { throw error; }
          resolve(JSON.parse(inflated.toString('utf8')))
        });
      });
    });
  }

  function write(path, object) {
    return new Promise(resolve => {
      const input = Buffer.from(JSON.stringify(object),'utf8');

      zlib.deflate(input, (error, encoded) => {
        if (error) { throw error; }

        fs.writeFile(path, encoded, (error) => {
          if (error) { throw error; }
          resolve();
        });
      });
    });
  }

  return { read, write };

})();
