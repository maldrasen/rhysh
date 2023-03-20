global.InterruptAction = class InterruptAction {

  #chance;
  #actionType;
  #targetType;
  #story;

  constructor(options) {
    this.#chance = options.chance || 100;
    this.#actionType = options.actionType;
    this.#targetType = options.targetType;
    this.#story = options.story;
  }

  get chance() { return this.#chance; }
  get actionType() { return this.#actionType; }
  get targetType() { return this.#targetType; }
  get story() { return this.#story; }

  pack() {
    let packed = {
      chance: this.#chance,
      actionType: this.#actionType,
      story: this.#story,
    };

    if (this.#targetType) { packed.targetType = this.#targetType; }

    return packed;
  }

}