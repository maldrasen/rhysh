const EventDictionary = {}

global.Event = class Event {

  static register(event) {
    EventDictionary[event.code] = event;
  }

  static lookup(code) {
    if (EventDictionary[code] == null) { throw `Unknown Event (${code})` }
    return EventDictionary[code];
  }

  #code;
  #attributeChecks;
  #speakers;
  #onFinish;
  #stages;

  constructor(code) {
    this.#code = code;
    this.#stages = [];
  }

  get code() { return this.#code; }
  get attributeChecks() { return this.#attributeChecks; }
  get speakers() { return this.#speakers; }
  get onFinish() { return this.#onFinish; }
  get stages() { return this.#stages; }

  setAttributeChecks(checks) { this.#attributeChecks = checks; }
  setSpeakers(speakers) { this.#speakers = speakers; }
  setOnFinish(onFinish) { this.#onFinish = onFinish; }

  addStage(stageData={}) {
    let stage = new Stage(stageData);
    this.#stages.push(stage);
    return stage;
  }

  addSelectionStage(stageData) {
    this.#stages.push(new SelectionStage(stageData));
  }
}
