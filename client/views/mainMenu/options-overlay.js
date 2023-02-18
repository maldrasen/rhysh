window.OptionsOverlay = (function() {

  const ZoomMapping = {
    1: 0.50,
    2: 0.59,
    3: 0.69,
    4: 0.85,
    5: 1.00,
    6: 1.20,
    7: 1.40,
    8: 1.70,
    9: 2.20,
  };

  let options = {};
  let zoomSlider;

  function init() {
    X.onClick('#optionsOverlay a.close-button', close);
    X.onClick('#optionsOverlay a.save-button', save);
  }

  function build() {
    Template.load('#optionsOverlay','client/views/mainMenu/options-overlay.html').then(loaded => {

      zoomSlider = new Slider({
        id: 'zoomSlider',
        parent: X.first('#optionsOverlay .zoom-container'),
        min: 1,
        max: 9,
      });
      zoomSlider.build();

    });
  }

  function show() {
    let overlay = X.first('#optionsOverlay');
    let mainMenu = X.first('#mainMenu');

    zoomSlider.setValue(options.zoom);

    if (mainMenu) {
      X.addClass(mainMenu,'hide');
    }

    X.removeClass(overlay,'hide');
  }

  function close() {
    X.addClass('#optionsOverlay','hide');
    X.removeClass('#mainMenu','hide');
  }

  function save() {

  }

  function setZoom(zoom) {
    options.zoom = zoom;
    X.first('body').setAttribute('style',`zoom:${ZoomMapping[zoom]}`)
  }

  return {
    init,
    build,
    show,
    setZoom,
  };

})();