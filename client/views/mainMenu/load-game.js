window.LoadGame = (function() {

  function init() {
    X.onClick('#loadGame .back-to-main-button', showMainMenu);
  }

  function showMainMenu() {
    X.empty('#loadGame .game-list');
    X.removeClass('#mainMenu','hide');
    X.addClass('#loadGame','hide');
  }

  function show(gameList) {
    gameList.forEach(gameData => {
      addGameItem(gameData);
    });

    X.removeClass('#loadGame','hide');
  }

  function addGameItem(gameData) {
    let template = X.copyElement('#loadGame .game-template .game');
        template.setAttribute('data-world-index',gameData.worldIndex);

    addText(template, '.top-row .name .first',         gameData.firstName);
    addText(template, '.top-row .name .last',          gameData.lastName);
    addText(template, '.top-row .details .level',      gameData.level);
    addText(template, '.top-row .details .sex',        sexDisplay(gameData.sex));
    addText(template, '.top-row .details .species',    gameData.species);
    addText(template, '.top-row .details .archetype',  gameData.archetype);
    addText(template, '.extra .date',                  gameData.date.toLocaleString());
    addText(template, '.extra .location',              gameData.location);

    X.first('#loadGame .game-list').appendChild(template);
  }

  function sexDisplay(code) {
    return { male:'Male', female:'Female', futa:'Futanari' }[code]
  }

  function addText(template, selector, text) {
    template.querySelectorAll(selector)[0].appendChild(document.createTextNode(text));
  }

  return {
    init,
    show,
  };

})();