global.EventState = class EventState {

  #code;
  #state;

  // The event object represents a queued event. I'm not sure even about the
  // event queue at the moment, but I'm anticipating that this will be
  // nessessary. When events are queued they may need to remember some
  // internal state that will be needed once the event is rendered. On the
  // other hand I don't have any events like this, so I'm just guessing about
  // what I'll need given what the other version of this game had.

  // States can be null or an arbritrary data object. The state cannot hold
  // instances of classes though as they wouldn't be properly serialized.
  constructor(code, state={}) {
    this.#code = code;
    this.#state = state;
  }

  getCode() { return this.#code; }
  getState() { return this.#state; }

  // === Persistance ===========================================================

  pack() {
    return {
      code: this.#code,
      state: this.#state,
    }
  }

  static unpack(data) {
    return new EventState(data.code, data.state);
  }

}
