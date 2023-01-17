
// Elements
import BackgroundImage from './elements/background-image.js'

// Tools
import X from './tools/exacto.js'

// Views
import MainMenu from "./views/mainMenu/main-menu.js"
import MapView from "./views/mapView/map-view.js"
import PauseMenu from "./views/pauseMenu/pause-menu.js"

export default () => {

  // Elements
  window.BackgroundImage = BackgroundImage;

  // Tools
  window.X = X;

  // Views
  window.MainMenu = MainMenu
  window.MapView = MapView
  window.PauseMenu = PauseMenu

}
