window.RadioButtons = class RadioButtons {

  #currentValue;
  #choices;
  #onSelect;
  #element;

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
  getValue() { return this.#currentValue; }

  addChoice(choice) {
    let button = X.createElement(`<a href='#' class='radio-button'>`)
    button.setAttribute('data-value',choice.value);
    button.innerHTML = choice.label;
    button.addEventListener('click', event => {
      this.setValue(event.target.getAttribute('data-value'));
    });

    if (choice.value == this.#currentValue) {
      X.addClass(button,'on');
    }

    this.#element.appendChild(button);
  }

  setValue(value) {
    if (value != this.#currentValue) {
      this.#currentValue = value;

      let other = this.#element.querySelector('.on');
      if (other) {
        X.removeClass(other,'on');
      }

      X.addClass(this.#element.querySelector(`.radio-button[data-value="${value}"]`),'on')
      if (this.#onSelect) {
        this.#onSelect({ radioButtons:this, value:value });
      }
    }
  }

}
