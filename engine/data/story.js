global.Story = class Story {

  #requires;
  #tryText;
  #hitText;
  #missText;
  #setCondition;
  #addStatus;

  constructor(options) {
    this.#requires = options.requires;
    this.#tryText = options.tryText;
    this.#hitText = options.hitText;
    this.#missText = options.missText;
    this.#setCondition = options.setCondition;
    this.#addStatus = options.addStatus;
  }

  get requires() { return this.#requires; }
  get tryText() { return this.#tryText; }
  get hitText() { return this.#hitText; }
  get missText() { return this.#missText; }
  get setCondition() { return this.#setCondition; }
  get addStatus() { return this.#addStatus; }
}
