global.Switchboard = (function() {

  const RhyshEvents = class RhyshEvents extends events.EventEmitter {}
  const $rhyshEvents = new RhyshEvents();

  let $renderCallback;
  let $renderBattleCallback;

  // This may look a bit odd because we're only allowing a single event
  // listener for all these game events. We're only passing events like this
  // because the engine and the server needed to be decoupled, so that the
  // engine can have unit tests without needing any of the electron server
  // stuff existing at all.
  function init() {
    $rhyshEvents.on('server.start', () => {
      console.log("Loading Server");
      Loader.loadDirectory(`${ROOT}/engine/controllers`);
      Loader.loadDirectory(`${ROOT}/engine/server`);

      console.log("Initializing");
      FeatureSet.init();
      Browser.init();
      Controllers.init();
    })

    $rhyshEvents.on('browser.render', state => {
      if ($renderCallback) { $renderCallback(state); }
    });

    $rhyshEvents.on('browser.render-battle-round', state => {
      if ($renderBattleCallback) { $renderBattleCallback(state); }
    });
  }

  function startServer() { $rhyshEvents.emit('server.start'); }
  function serverReady() { $rhyshEvents.emit('server.ready'); }
  function render(state) { $rhyshEvents.emit('browser.render',state); }
  function renderBattleRound(state) { $rhyshEvents.emit('browser.render-battle-round',state); }
  function onRender(callback) { $renderCallback = callback; }
  function onRenderBattleRound(callback) { $renderBattleCallback = callback; }

  return {
    init,
    startServer,
    serverReady,
    render,
    renderBattleRound,
    onRender,
    onRenderBattleRound,
  };

})();
