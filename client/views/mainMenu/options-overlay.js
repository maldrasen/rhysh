window.OptionsOverlay = (function() {

  const FontSizes = {
    1: 8,
    2: 9,
    3: 10,
    4: 12,
    5: 14,
    6: 16,
    7: 18,
    8: 20,
    9: 24,
  };

  let options;
  let fontSizeSlider;

  function init() {
    X.onCodeDown(27, isOpen, close);
    X.onClick('#optionsOverlay a.close-button', close);
    X.onClick('#optionsOverlay a.save-button', save);
  }

  function build() {
    Template.load('#optionsOverlay','client/views/mainMenu/options-overlay.html').then(loaded => {

      fontSizeSlider = new Slider({
        id: 'fontSizeSlider',
        parent: X.first('#fontSizeContainer'),
        min: 1,
        max: 9,
        formatter: value => { return `${FontSizes[value]} point` },
        onChange: event => { updateFontSize(event.value); },
      });
      fontSizeSlider.build();

    });
  }

  function setOptions(data) {
    options = data;
  }

  function show() {
    let mainMenu = X.first('#mainMenu');

    fontSizeSlider.setValue(options.fontSize);
    updateFontSize(options.fontSize)

    if (mainMenu) {
      X.addClass(mainMenu,'hide');
    }

    X.removeClass('#optionsOverlay','hide');
  }

  function updateFontSize(value) {
    X.first('#fontSizeExample').setAttribute('class',`font-size-${value}`);
  }

  function close() {
    X.addClass('#optionsOverlay','hide');
    X.removeClass('#mainMenu','hide');
  }

  function isOpen() {
    return X.hasClass('#optionsOverlay','hide') == false;
  }

  function save() {
    options.fontSize = fontSizeSlider.getValue();

    ClientCommands.send('options.save',options).then(status => {
      console.log("Status:",status);
    })

    close();
  }

  return {
    init,
    build,
    show,
    setOptions,
    isOpen,
  };

})();