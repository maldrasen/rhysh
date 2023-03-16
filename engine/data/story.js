global.Story = class Story {

  #requires;
  #tryText;
  #hitText;
  #setCondition;
  #addStatus;

  constructor(options) {
    this.#requires = options.requires;
    this.#tryText = options.tryText;
    this.#hitText = options.hitText;
    this.#setCondition = options.setCondition;
    this.#addStatus = options.addStatus;
  }

  get requires() { return this.#requires; }
  get tryText() { return this.#tryText; }
  get hitText() { return this.#hitText; }
  get setCondition() { return this.#setCondition; }
  get addStatus() { return this.#addStatus; }
}
