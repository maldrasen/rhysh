export default (function() {

  function init() {
    X.onClick('#mainMenu a.preview-features', previewFeatures);
    X.onClick('#mainMenu a.preview-zone', previewZone);
  }

  function previewFeatures() {
    MapView.setProperties({ sourceType:"Feature" });
    MainContent.setStage(MapView);
  }

  function previewZone() {
    MapView.setProperties({ sourceType:"Zone" });
    MainContent.setStage(MapView);
  }

  function show() {
    MainContent.show({ path:"client/views/mainMenu/main-menu.html", classname:'main-menu', background:'main-menu' }).then(() => {
      MainContent.hideCover({ fadeTime:1000 });
    });
  }

  return {
    name: "MainMenu",
    init: init,
    show: show,
  };

})();
