export default (function() {

  function show() {
    MainContent.show({ path:"client/views/mainMenu/main-menu.html", classname:'main-menu', background:'main-menu' }).then(() => {
      MainContent.hideCover({ fadeTime:1000 });
    });
  }

  return {
    name: "MainMenu",
    show: show,
  };

})();
