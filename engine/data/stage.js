global.Stage = class Stage {

  #background;
  #filter;
  #when;
  #pages;

  constructor(data) {
    this.#background = data.background;
    this.#filter = data.filter;
    this.#when = data.when;
    this.#pages = [];
  }

  get type() { return _normalStage; }
  get background() { return this.#background; }
  get filter() { return this.#filter; }
  get when() { return this.#when; }
  get pages() { return this.#pages; }

  // Add a page with either of these formats:
  //   stage.addPage('Text Template')
  //   stage.addPage({ options },'Event Template')
  addPage(arg1,arg2) {
    this.pages.push(typeof arg1 == 'string' ? { text:arg1 } : { text:arg2, ...arg1 });
  }

}