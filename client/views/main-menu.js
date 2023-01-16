
import X from '../tools/exacto.js'

const MainMenu = (function() {

  function build() {
    X('body').className = "main-menu";
    X('.loading').remove();
    X('#mainContent').append("TODO: Main Menu");
  }

  return {
    build: build,
  };

})();

export default MainMenu;
