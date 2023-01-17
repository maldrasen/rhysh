export default (function() {

  function build() {
    BackgroundImage.setBackground("main-menu");

    X('body').className = "main-menu";
    X('.loading').remove();
    X('#mainContent').append("TODO: Main Menu");
  }

  return {
    build: build,
  };

})();
