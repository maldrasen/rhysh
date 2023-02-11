global.EventQueue = (function() {

  var eventQueue = [];

  function clear() {
    currentEvent = null;
    eventQueue = [];
  }

  function addEvent(code, state={}) {
    eventQueue.push({ code:code, state:state });
  }

  return {
    clear,
    addEvent,
  }

})();
