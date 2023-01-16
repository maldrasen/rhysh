global.Messenger = (function() {

  let listeners = {};
  let sequence = 1;

  function publish(channel, data={}) {
    (listeners[channel]||[]).forEach(listener => {
      listener.callback(data, { listener_id:listener.id });
    });
  }

  // The subscribe function returns the ID of the listener that will respond
  // on this channel, if at some point something needs to unsubscribe.
  function subscribe(channel, callback) {
    let id = sequence++;
    if (listeners[channel] == null) { listeners[channel] = []; }
    listeners[channel].push({ id:id, callback });
    return id
  }

  // The request() function allows for synchronous messaging between modules.
  // For this to work modules must still subscribe() to channels that they'll
  // handle.
  //
  // This function can be called with three distinct signatures:
  //    request(channel, data, response)
  //    request(channel, response)
  //    request(channel, data)
  async function request(channel) {
    let data = {};
    let responseCallback = null;
    let responses = [];

    if (arguments.length == 3) {
      data = arguments[1];
      responseCallback = arguments[2];
    }

    if (arguments.length == 2) {
      if (typeof arguments[1] == 'function') { responseCallback = arguments[1]; }
      if (typeof arguments[1] == 'object')   { data = arguments[1]; }
    }

    await Promise.all((listeners[channel]||[]).map(async listener => {
      responses.push(await listener.callback(data, { listener_id:listener.id }));
    }));

    if (responseCallback) {
      await responseCallback((responses.length > 1) ? responses : responses[0]);
    }
  }

  // Unsubscribe a listener given it's channel and id. I'm not sure yet if this
  // is something that we'll ever need to do, but the functionality is there if
  // we need it.
  function unsubscribe(channel, listener_id) {
    let remaining = [];
    each(listeners[channel], listener => {
      if (listener.id != listener_id) { remaining.push(listener); }
    });
    listeners[channel] = remaining;
  }

  // The specs at least need to cleanup anything that they've registered.
  function unsubscribeAll(channel) {
    listeners[channel] = null;
  }

  return {
    publish,
    subscribe,
    request,
    unsubscribe,
    unsubscribeAll,
  }

})();
