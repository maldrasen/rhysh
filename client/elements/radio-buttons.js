window.RadioButtons = class RadioButtons {

  #currentValue;
  #choices;
  #onSelect;
  #element;

  static init() {

    X.onClick('.radio-buttons .radio-button', event => {
      console.log("Click:",event.target)
      // Wat?
      // $(this).data('controller').setValue($(this).data('value'));
    });
  }

  // RadioButtons have the following options:
  //   currentValue:  Currently selected value.
  //   onSelect:      Select callback, only triggers when value changes.
  //   choices:       [{ label:'Yes', value:'Y' },...]
  constructor(options) {
    this.#currentValue = options.currentValue;
    this.#choices = options.choices;
    this.#onSelect = options.onSelect;
    this.#element = X.createElement(`<div class='radio-buttons'></div>`);

    (options.choices||[]).forEach(choice => {
      this.addChoice(choice);
    });
  }

  getElement() { return this.#element; }
  getCurrentValue() { return this.#currentValue; }

  addChoice(choice) {
    console.log("Add Choice:",choice)
    // let button = $('<a>',{ href:'#', class:'radio-button' }).
    //   attr('data-value',choice.value).
    //   data('controller',this).
    //   append(choice.label);

    // if (choice.value == this.currentValue) {
    //   button.addClass('on');
    // }

    // this.element.append(button);
  }

  setValue(value) {
    // if (value != this.currentValue) {
    //   this._currentValue = value;
    //   this.element.find('.on').removeClass('on');
    //   this.element.find(`.radio-button[data-value="${value}"]`).addClass('on');

    //   if (typeof this._onSelect == 'function') {
    //     this._onSelect({ radioButtons:this, value:value });
    //   }
    // }
  }

}
