let activeDrag;
let sliderDictionary = {};

window.Slider = class Slider {

  static init() {
    window.addEventListener('keydown', event => {
      if (event.keyCode < 37) { return; }
      if (event.keyCode > 40) { return; }

      X.each(':hover', element => {
        if (X.hasClass(element, 'slider')) {
          let slider = sliderDictionary[element.getAttribute('id')];
          if (slider) {
            if (event.keyCode == 37) { slider.stepDown(); }
            if (event.keyCode == 38) { slider.stepUp();   }
            if (event.keyCode == 39) { slider.stepUp();   }
            if (event.keyCode == 40) { slider.stepDown(); }
          }
        }
      });
    });
  }

  // Slider options:
  //   * parent      - Element to generate the slider inside of
  //   * min         - Min slider value
  //   * max         - Max slider value
  //   * id          - Id of the generated slider element
  //   step          - How much to change slider value when clicked or arrowed through
  //   displayValue  - Show the value of the slider as a number
  //   value         - Initial value for the slider
  //   unit          - Value postfix
  //   formatter     - Function used to format the value for the display
  //   onChange      - Function that's called when the value changes
  constructor(options) {
    this.elementID = options.id;
    this.parent = options.parent;
    this.min = options.min;
    this.max = options.max;

    this.step = options.step || 1;
    this.value = options.value || options.min;
    this.displayValue = options.displayValue || true;
    this.unit = options.unit || '';

    this.formatter = options.formatter;
    this.onChange = options.onChange;

    sliderDictionary[this.elementID] = this;
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
    this.element.addEventListener('wheel', event => { (event.deltaY > 0) ? this.stepDown() : this.stepUp() });
    this.parent.appendChild(this.element);
  }

  getTrack() { return this.element.querySelector('.slider-track'); }
  getHandle() { return this.element.querySelector('.slider-handle'); }
  getLabel() { return this.element.querySelector('.slider-label'); }
  getValue() { return this.value; }
  getMax() { return this.max; }
  getMin() { return this.min; }

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

  stepUp() { if (this.value != this.max) { this.setValue(this.value + this.step); }}
  stepDown() { if (this.value != this.min) { this.setValue(this.value - this.step); }}

  positionHandle() {
    let percent = (this.value-this.min) / (this.max - this.min) * 100;
    this.getHandle().setAttribute('style',`left:calc(${percent}% - 5px)`);
  }

  clickTrack(event) {
    (event.clientX > X.getPosition(this.getHandle()).x) ? this.stepUp() : this.stepDown();
  }

  startDrag(event) {
    let body = X.first('body');
    let stepSize = X.getPosition(this.getTrack()).width / (this.max - this.min);

    body.addEventListener('mousemove', moveHandle);
    body.addEventListener('mouseup', stopDrag);
    body.addEventListener('mouseleave', stopDrag);

    activeDrag = {
      slider: this,
      startPosition: event.pageX,
      startValue: this.value,
      stepSize: stepSize,
    };
  }

}

// The removeEventListener() functions don't work well if the listener function
// is a member of an instance of a class.

function stopDrag(event) {
  let body = X.first('body');

  body.removeEventListener('mousemove', moveHandle);
  body.removeEventListener('mouseup', stopDrag);
  body.removeEventListener('mouseleave', stopDrag);

  activeDrag = null;
}

function moveHandle(event) {
  let value = activeDrag.startValue;
  let dragDelta = event.pageX - activeDrag.startPosition;
  let min = activeDrag.slider.getMin();
  let max = activeDrag.slider.getMax();

  if (dragDelta < 0) {
    value = activeDrag.startValue - Math.round(-dragDelta / activeDrag.stepSize)
  }
  if (dragDelta > 0) {
    value = activeDrag.startValue + Math.round(dragDelta / activeDrag.stepSize);
  }

  if (value > max) { value = max; }
  if (value < min) { value = min; }

  if (value != activeDrag.slider.getValue()) {
    activeDrag.slider.setValue(value);
  }
}
