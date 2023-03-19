global.Trigger = class Trigger {

  static exit(options) {
    return new Trigger({
      type: _triggerExit,
      exitOptions: options,
    });
  }

  #type;
  #exitOptions;

  constructor(options) {
    this.#type = options.type;
    this.#exitOptions = options.exitOptions;
  }

  get type() { console.trace(); throw 'Use getType() instead.' }
  get exitOptions() { console.trace(); throw 'Use getExitOptions() instead.' }

  getType() { return this.#type; }
  getExitOptions() { return this.#exitOptions; }
  isExit() { return this.#type == _triggerExit }

  // === Persistance ===========================================================

  pack() {
    const trigger = {
      type: this.#type
    };

    if (this.#exitOptions) {
      trigger.exitOptions = this.#exitOptions;
    }

    return trigger;
  }

  static unpack(data) {
    return new Trigger(data);
  }

}


