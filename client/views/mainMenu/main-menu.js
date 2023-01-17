export default (function() {

  function show() {
    MainContent.show({ path:"client/views/mainMenu/main-menu.html", classname:'main-menu', background:'main-menu' }).then(() => {
      console.log("OK, finally everything is completely loaded and ready.");
    });
  }

  return {
    show: show,
  };

})();
