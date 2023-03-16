const EventDictionary = {}

global.Event = class Event {

  static register(event) {
    GnosisDictionary[event.code] = event;
  }

  static lookup(code) {
    if (EventDictionary[code] == null) { throw `Unknown Event (${code})` }
    return EventDictionary[code];
  }

  #code;

  constructor(code, data) {
    this.#code = code;
  }

  get code() { return this.#code; }

}
