global.CharacterLibrary = (function() {

  let characterCache = {};

  function clear() {
    characterCache = {};
  }

  function isCharacterReady(code) {
    return characterCache[code] != null;
  }

  // Getting a character will load it from disk the first time.
  function getCharacter(code, callback) {
    return isCharacterReady(code) ?
      callback(characterCache[code]) :
      loadCharacter(code).then(character => callback(character));
  }

  // If we know a character is cached we can get them without a callback.
  function getCachedCharacter(code) {
    return characterCache[code];
  }

  // The main character should always be cached.
  function getMainCharacter() {
    return characterCache['Main'];
  }

  // Save this character and add them to the character cache. I don't think we
  // ever need to wait for a character to save. Accessing a character
  // immeadietly after it's saved just pulls it from the cache.
  function saveCharacter(character) {
    characterCache[character.getCode()] = character;

    if (GameState.getWorldPath()) {
      console.log(`Saving Character: ${character.getCode()} (${character.getFullName()})`);
      Kompressor.write(getFilepath(character.getCode()), character.pack());
    }
  }

  function saveAll() {
    ObjectHelper.each(characterCache, code => {
      saveCharacter(characterCache[code]);
    });
  }

  function loadCharacter(code) {
    return new Promise(resolve => {
      Kompressor.read(getFilepath(code)).then(data => {
        let character = Character.unpack(data);
        characterCache[code] = character;
        console.log(`Loading Character: ${code} (${character.getFullName()})`);
        resolve(character);
      });
    });
  }

  function loadMainCharacter() {
    return loadCharacter('Main');
  }

  function getFilepath(code) {
    return `${GameState.getWorldPath()}/Character-${code}.cum`;
  }

  return {
    clear,
    isCharacterReady,
    getCharacter,
    getCachedCharacter,
    getMainCharacter,
    saveCharacter,
    saveAll,
    loadCharacter,
    loadMainCharacter,
  }

})();
