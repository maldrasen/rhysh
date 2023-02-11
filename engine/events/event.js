global.Event = class Event {

  // State scan be null or an arbritrary data object. The state cannot hold
  // instances of classes though as they wouldn't be properly serialized.
  constructor(code, state) {
    this.code = code;
    this.state = state;
  }

  // === Persistance ===========================================================

  pack() {
    return {
      code: this.code,
      state: this.state,
    }
  }

  static unpack(data) {
    return new Event(data.code, data.state);
  }

}