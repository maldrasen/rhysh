window.LoadGame = (function() {

  function init() {
    X.onClick('#loadGame .back-to-main-button', showMainMenu);
    X.onClick('#loadGame .game', loadGame);
    X.onClick('#loadGame .game .delete-game', deleteGame);
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

    ScrollingPanel.resize('#loadGame');
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

  function loadGame(event) {
    if (event.target.matches('.delete-game')) { return false; }

    MainContent.clear();
    ClientCommands.send('game.load', event.target.closest('.game').getAttribute('data-world-index'));
  }

  function deleteGame(event) {
    let gameElement = event.target.closest('.game');
    let worldIndex = gameElement.getAttribute('data-world-index');
    let confirmationElement = buildConfirmationElement(gameElement);

    Confirmation.show({
      element: confirmationElement,
      onConfirm: () => {
        ClientCommands.send('game.delete', worldIndex);
        gameElement.remove();
        resetIfEmpty();
      }
    });
  }

  function resetIfEmpty() {
    if (X.first('#loadGame .scrolling-panel .game') != null) { return; }

    X.addClass('#mainMenu .continue-button','disabled');
    X.addClass('#mainMenu .load-button','disabled');

    showMainMenu();
  }

  function buildConfirmationElement(gameElement) {
    let element = X.createElement(`<div class='delete-game-confirmation'><div class='question'>Delete this game?</div></div>`);
        element.appendChild(gameElement.querySelector('.top-row').cloneNode(true));
    return element;
  }

  return {
    init,
    show,
  };

})();