
window.Renderer = (function() {

  function init() {
    ServerEvents.onRender((payload, viewState) => {
      render(viewState);
    });
  }

  function render(viewState) {
    console.log("Render:",viewState);
  }

  return { init }

})();
