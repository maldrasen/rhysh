window.Slider = class Slider {

  // Slider options:
  //   * id
  //   * parent
  //   * min
  //   * max
  //   displayValue (optional) - Show the value of the slider as a number.
  //   value (optional) - Initial value for the slider.
  //   unit (optional) - Value postfix.
  constructor(options) {
    this.elementID = options.id;
    this.parent = options.parent;
    this.min = options.min;
    this.max = options.max;
    this.value = options.value || options.min;

    this.displayValue = options.displayValue || true;
    this.formatter = options.formatter;
    this.unit = options.unit || '';
  }

  build() {
    this.element = X.createElement(`
      <div id='${this.elementID}' class='slider'>
        <input type="text"/>
        <div class='slider-track'></div>
        <div class='slider-handle'></div>
        <div class='slider-label'></div>
      </div>`);

    this.parent.appendChild(this.element);
  }

  getHandle() {
    return this.element.querySelector('.slider-handle');
  }

  getLabel() {
    return this.element.querySelector('.slider-label');
  }

  setValue(value) {
    if (value > this.max) { throw `Value greater than max`; }
    if (value < this.min) { throw `Value less than min`; }

    this.value = value;
    this.positionHandle();

    if (this.displayValue) {
      this.getLabel().innerHTML = (this.formatter) ? this.formatter(value) : `${value}${this.unit}`;
    }
  }

  positionHandle() {
    let percent = (this.value-this.min) / (this.max - this.min) * 100;

    this.getHandle().setAttribute('style',`left:calc(${percent}% - 5px)`);
  }

}