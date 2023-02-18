window.Slider = class Slider {

  // Slider options:
  //   * id
  //   * parent
  //   * min
  //   * max
  constructor(options) {
    this.elementID = options.id;
    this.parent = options.parent;
    this.min = options.min;
    this.max = options.max;
    this.value = options.value || options.min;
  }

  build() {
    this.element = X.createElement(`
      <div id='${this.elementID}' class='slider'>
        <input type="text"/>
        <div class='slider-track'></div>
        <div class='slider-handle'></div>
      </div>
    `);

    this.parent.appendChild(this.element);
  }

  setValue(value) {
    this.value = value;
    this.positionHandle();
  }

  positionHandle() {
    console.log("Reposition Handle...")
  }

}