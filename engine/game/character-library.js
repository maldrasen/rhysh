global.CharacterLibrary = (function() {

  let $characterCache = {};

  function clear() {
    $characterCache = {};
  }

  function isCharacterReady(code) {
    return $characterCache[code] != null;
  }

  // Getting a character will load it from disk the first time.
  function getCharacter(code, callback) {
    return isCharacterReady(code) ?
      callback($characterCache[code]) :
      loadCharacter(code).then(character => callback(character));
  }

  // If we know a character is cached we can get them without a callback.
  function getCachedCharacter(code) {
    return $characterCache[code];
  }

  // The main character should always be cached.
  function getMainCharacter() {
    return $characterCache['Main'];
  }

  // TODO: Once we have more than one party member we'll need a way to fetch
  //       the entire party at once. It's important for all the party members
  //       to be loaded when the game is loaded because they'll be accessed
  //       regularly. The party member position is also important. We'll need a
  //       way to keep track of party composition and order.
  function getParty() {
    return {
      main: getMainCharacter(),
      position_1: null,
      position_2: null,
      position_3: null,
      position_4: null,
      position_5: null,
      position_6: null,
    };
  }

  // Maybe temp? There will probable be a better way to determine character
  // position in the future.
  function getCharacterPosition(code) {
    let currentPosition;

    CharacterLibrary.eachActivePartyMember((position, character) => {
      if (character.getCode() == code) {
        currentPosition = position;
      }
    });

    if (currentPosition == null) {
      throw `Character(${code}) is not in party.`
    }

    return currentPosition;
  }

  function eachActivePartyMember(callback) {
    ObjectHelper.each(getParty(), (position, character) => {
      if (character) { callback(position, character); }
    });
  }

  // Save this character and add them to the character cache. I don't think we
  // ever need to wait for a character to save. Accessing a character
  // immeadietly after it's saved just pulls it from the cache.
  function saveCharacter(character) {
    $characterCache[character.getCode()] = character;

    if (GameState.getWorldPath()) {
      console.log(`Saving Character: ${character.getCode()} (${character.getFullName()})`);
      Kompressor.write(getFilepath(character.getCode()), character.pack());
    }
  }

  function saveAll() {
    ObjectHelper.each($characterCache, code => {
      saveCharacter($characterCache[code]);
    });
  }

  function loadCharacter(code) {
    return new Promise(resolve => {
      Kompressor.read(getFilepath(code)).then(data => {
        let character = Character.unpack(data);
        $characterCache[code] = character;
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
    getParty,
    getCharacterPosition,
    eachActivePartyMember,
    saveCharacter,
    saveAll,
    loadCharacter,
    loadMainCharacter,
  }

})();
