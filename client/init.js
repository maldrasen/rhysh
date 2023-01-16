import MainMenu from "./views/mainMenu/main-menu.js"

(function() {
  console.log('=== Booting Client ===');

  try {

    ServerEvents.onReady((payload, environment) => {
      console.log(`Rhysh started in ${environment.name} mode.`)
      MainMenu.build();
    });

    ClientCommands.ready();

  } catch(e) {
    console.error("\n!!! Error Booting Client Process !!!\n");
    console.error(e);
  }

})();
