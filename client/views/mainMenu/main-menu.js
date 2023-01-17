export default (function() {

  function build() {
    BackgroundImage.setBackground("main-menu");

    X('body').className = "main-menu";
    X('.loading').remove();

    Template.load(X('#mainContent'), "client/views/mainMenu/main-menu.html")
  }

  return {
    build: build,
  };

})();
