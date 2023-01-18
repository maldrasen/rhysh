
// Components
import MainContent from './components/main-content.js'

// Elements
import BackgroundImage from './elements/background-image.js'

// Tools
import Template from './tools/template.js'
import X from './tools/exacto.js'

// Views
import MainMenu from "./views/mainMenu/main-menu.js"
import MapView from "./views/mapView/map-view.js"
import PauseMenu from "./views/pauseMenu/pause-menu.js"

export default () => {

  // Components
  window.MainContent = MainContent;

  // Elements
  window.BackgroundImage = BackgroundImage;

  // Tools
  window.Template = Template;
  window.X = X;

  // Views
  window.MainMenu = MainMenu
  window.MapView = MapView
  window.PauseMenu = PauseMenu

  // Run all initializers
  MainContent.init();
  MainMenu.init();

}
