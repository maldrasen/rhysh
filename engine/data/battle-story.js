global.BattleStory = class Story {

  #requires;
  #actionText;
  #successText;
  #failureText;
  #setCondition;
  #addStatus;

  constructor(options) {
    this.#requires = options.requires;
    this.#actionText = options.actionText;
    this.#successText = options.successText;
    this.#failureText = options.failureText;
    this.#setCondition = options.setCondition;
    this.#addStatus = options.addStatus;
  }

  get requires() { return this.#requires; }
  get actionText() { return this.#actionText; }
  get successText() { return this.#successText; }
  get failureText() { return this.#failureText; }
  get setCondition() { return this.#setCondition; }
  get addStatus() { return this.#addStatus; }
}
