window.NewGame = (function() {

  function init() {

  }

  function show() {
    MainContent.show({ path:"client/views/mainMenu/new-game.html", classname:'new-game', background:'new-game' }).then(() => {
      MainContent.hideCover({ fadeTime:2000 });
      fadeIn();
    });
  }

  function enableStart() {
    X.first('#newGame .start-button').setAttribute('class','button send-command start-button')
  }

  function fadeIn() {
    let newGame = X.first('#newGame');
    let tween = new TWEEN.Tween({ opacity:0 });

    let animate = () => {
      if (tween) {
        requestAnimationFrame(animate);
        TWEEN.update();
      }
    }

    tween.to({ opacity:1 }, 2000);
    tween.easing(TWEEN.Easing.Quadratic.Out)
    tween.onUpdate(t => {
      newGame.setAttribute('style',`opacity:${t.opacity}`);
    });

    tween.onComplete(()=>{
      tween = null;
      newGame.removeAttribute('style');

      // TEMP.. Needs to ask if Wolgur is loaded on a loop.
      enableStart();
    });

    setTimeout(() => {
      tween.start();
      animate();
    },500);
  }

  return { init, show, fadeIn }

})();