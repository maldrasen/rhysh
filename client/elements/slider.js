window.Slider = class Slider {

  // Slider options:
  //   * id
  //   * parent
  //   * min
  //   * max
  //   step - How much to change slider value when clicked or arrowed through.
  //   displayValue (optional) - Show the value of the slider as a number.
  //   value (optional) - Initial value for the slider.
  //   unit (optional) - Value postfix.
  //   onChange - Function that's called when the value changes.
  constructor(options) {
    this.elementID = options.id;
    this.parent = options.parent;
    this.min = options.min;
    this.max = options.max;
    this.step = options.step || 1;
    this.value = options.value || options.min;
    this.displayValue = options.displayValue || true;
    this.formatter = options.formatter;
    this.unit = options.unit || '';
    this.onChange = options.onChange;
  }

  build() {
    this.element = X.createElement(`
      <div id='${this.elementID}' class='slider'>
        <div class='slider-track'></div>
        <div class='slider-handle'></div>
        <div class='slider-label'></div>
      </div>`);

    this.getTrack().addEventListener('mousedown', event => { this.clickTrack(event); });
    this.getHandle().addEventListener('mousedown', event => { this.startDrag(event); });

    this.parent.appendChild(this.element);
  }

  getTrack() { return this.element.querySelector('.slider-track'); }
  getHandle() { return this.element.querySelector('.slider-handle'); }
  getLabel() { return this.element.querySelector('.slider-label'); }

  stepUp() { this.setValue(this.value + this.step); }
  stepDown() { this.setValue(this.value - this.step); }

  setValue(value) {
    let oldValue = this.value;

    if (value > this.max) { throw `Value greater than max`; }
    if (value < this.min) { throw `Value less than min`; }

    this.value = value;
    this.positionHandle();

    if (this.displayValue) {
      this.getLabel().innerHTML = (this.formatter) ? this.formatter(value) : `${value}${this.unit}`;
    }

    if (this.onChange && this.value != oldValue) {
      this.onChange({ slider:this, value:this.value, oldValue:oldValue });
    }
  }

  positionHandle() {
    let percent = (this.value-this.min) / (this.max - this.min) * 100;
    this.getHandle().setAttribute('style',`left:calc(${percent}% - 5px)`);
  }

  clickTrack(event) {
    (event.clientX > X.getPosition(this.getHandle()).x) ? this.stepUp() : this.stepDown();
  }

  startDrag(event) {
    console.log("Start Drag");
  }

}