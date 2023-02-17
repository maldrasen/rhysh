window.Alert = class Alert {

  // TODO: May add other icons like icons and shit in the future.
  constructor(options) {
    this.title = options.title;
    this.message = options.message;
    this.position = options.position;
    this.classname = options.classname || '';

    if (options.position == 'center') { this.parent = X.first('#centerAlerts'); }
    if (options.position == 'event') { this.parent = X.first('#eventAlerts'); }
    if (options.position == 'side') { this.parent = X.first('#sideAlerts'); }

    this.buildElement();
  }

  buildElement() {
    this.element = X.createElement(`<li class='alert ${this.position} ${this.classname}'></li>`);

    if (this.title) {
      this.element.appendChild(X.createElement(`<div class='title'>${this.title}</div>`));
    }

    this.element.appendChild(X.createElement(`<div class='message'>${this.message}</div>`));
  }

  display() {
    this.parent.appendChild(this.element);
    setTimeout(() => {
      X.addClass(this.element,'fade');
      setTimeout(() => {
        this.element.remove();
      },1000);
    },1000);
  }
}
