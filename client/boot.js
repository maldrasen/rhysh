(function() {
  console.log('=== Booting Client ===');

  window.global = window
  window.TileSize = 64;

  try {
    importAll().then(() => {
      console.log("Import Complete");
      initAll();
      console.log("Init Complete");

      // Received a message from the server letting us know that the server has
      // completely finished loading now. This will happen sometime after the
      // "client.ready" message we send just below.
      ServerEvents.onReady((payload, context) => {
        ready(context);
      });

      ClientCommands.ready();
    });
  } catch(e) {
    console.error("\n!!! Error Booting Client Process !!!\n");
    console.error(e);
  }

  async function importAll() {
    return Promise.all([

      import('./renderer.js'),

      // Engine
      import('../engine/constants.js'),
      import('../engine/data/species.js'),
      import('../engine/data/archetype.js'),
      import('../engine/models/dungeon/vector.js'),

      // Helpers
      import('../engine/helpers/array-helper.js'),
      import('../engine/helpers/object-helper.js'),
      import('../engine/helpers/random-helper.js'),
      import('../engine/helpers/rhysh-helper.js'),
      import('../engine/helpers/text-helper.js'),

      // Components
      import('./components/attribute-control.js'),
      import('./components/main-content.js'),

      // Elements
      import('./elements/alert.js'),
      import('./elements/background-image.js'),
      import('./elements/confirmation.js'),
      import('./elements/radio-buttons.js'),
      import('./elements/scrolling-panel.js'),
      import('./elements/slider.js'),
      import('./elements/tooltip.js'),

      // Models
      import('./models/tile-entry.js'),
      import('./models/tile-source.js'),

      // Tools
      import('./tools/template.js'),
      import('./tools/exacto.js'),

      // Views
      import('./views/battle/battle-controls.js'),
      import('./views/battle/battle-effects.js'),
      import('./views/battle/battle-player.js'),
      import('./views/battle/battle-view.js'),
      import('./views/battle/battlefield.js'),
      import('./views/dungeon/dungeon.js'),
      import('./views/event/event-view.js'),
      import('./views/mainMenu/escape-menu.js'),
      import('./views/mainMenu/load-game.js'),
      import('./views/mainMenu/main-menu.js'),
      import('./views/mainMenu/new-game.js'),
      import('./views/mainMenu/options-overlay.js'),
      import('./views/mapView/map-canvas.js'),
      import('./views/mapView/map-view.js'),
      import('./views/mapView/tile-graphics.js'),
      import('./views/partyPanel/party-panel.js'),
      import('./views/pauseMenu/pause-menu.js'),
      import('./views/townView/town-view.js'),

      // Data
      import('../engine/data/archetypes/chosen.js'),
      import('../engine/data/archetypes/cultist.js'),
      import('../engine/data/archetypes/dominatrix.js'),
      import('../engine/data/archetypes/knight.js'),
      import('../engine/data/archetypes/mindbender.js'),
      import('../engine/data/archetypes/slaver.js'),

      import('../engine/data/species/dragonkind.js'),
      import('../engine/data/species/elf.js'),
      import('../engine/data/species/lupin.js'),
      import('../engine/data/species/minotaur.js'),
      import('../engine/data/species/nymph.js'),
      import('../engine/data/species/orc.js'),
      import('../engine/data/species/satyr.js'),

      // Extras
      import('./extras/character-tooltips.js'),
    ]);
  }

  function initAll() {
    BattleControls.init();
    BattlePlayer.init();
    BattleView.init();
    Confirmation.init();
    Dungeon.init();
    EscapeMenu.init();
    EventView.init();
    LoadGame.init();
    MainContent.init();
    MainMenu.init();
    MapCanvas.init();
    NewGame.init();
    OptionsOverlay.init();
    PartyPanel.init();
    Renderer.init();
    ScrollingPanel.init();
    Slider.init();
    TileGraphics.init();
    Tooltip.init();
  }

  function ready(context) {
    window.Environment = context.environment;
    window.Options = context.settings;

    console.log(`Rhysh started in ${Environment.name} mode.`)

    document.title = Environment.debug ? 'Rhysh (DEBUG)' : 'Rhysh'
    X.remove('.loading');

    MainMenu.setContext(context);
    MainContent.setStage(MainMenu);
  }

})();
