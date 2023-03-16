global.SelectionStage = class SelectionStage {

  #key;
  #header;
  #selections;

  constructor(options) {
    this.#key = options.key;
    this.#header = options.header;
    this.#selections = options.selections;
  }

  get type() { return _selectionStage; }
  get key() { return this.#key; }
  get header() { return this.#header; }
  get selections() { return this.#selections; }
}
