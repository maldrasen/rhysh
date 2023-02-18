window.OptionsOverlay = (function() {

  const ZoomMapping = {
    1:0.17,  2:0.23,  3:0.28,  4:0.32,  5:0.41,
    6:0.50,  7:0.59,  8:0.69,  9:0.85,  10:1.00,
    11:1.20, 12:1.40, 13:1.70, 14:2.20, 15:2.50,
  };

  let options = {};
  let zoomSlider;

  function init() {
    X.onClick('#optionsOverlay a.close-button', close);
    X.onClick('#optionsOverlay a.save-button', save);
  }

  function build() {
    Template.load('#optionsOverlay','client/views/mainMenu/options-overlay.html').then(loaded => {



    });
  }

  function show() {
    let overlay = X.first('#optionsOverlay');
    let mainMenu = X.first('#mainMenu');

    X.first('#zoomInput').setAttribute('value',options.zoom);

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