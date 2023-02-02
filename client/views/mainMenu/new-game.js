window.NewGame = (function() {

  let selectedArchitype = 'knight';

  function init() {
    X.onClick('#newGame .architypes .button', e => { selectArchitype(e.target) });
  }

  function show() {
    MainContent.show({ path:"client/views/mainMenu/new-game.html", classname:'new-game', background:'new-game-1' }).then(() => {
      MainContent.hideCover({ fadeTime:500 });
    });
  }

  function selectArchitype(target) {
    let name = X.classesExcept(target, ['button','selected'])[0];
    if (name == selectedArchitype) { return; }

    X.removeClass('#newGame .architypes .selected','selected');
    X.addClass(`#newGame .descriptions .${selectedArchitype}`,'hide');
    X.addClass(target,'selected');
    X.removeClass(`#newGame .descriptions .${name}`,'hide');

    selectedArchitype = name;
  }





















  // Overlay element had style="opacity:0;"
  // background-color: rgba(0, 8, 16, 0.8);
  // Boat Start
  // MainContent.show({ path:"client/views/mainMenu/new-game.html", classname:'new-game', background:'new-game-2' }).then(() => {
  //   MainContent.hideCover({ fadeTime:2000 });
  //   fadeIn();
  //   testWolgur();
  // });

  function testWolgur() {
    setTimeout(function() {
      ClientCommands.send("dungeon.is-zone-ready",{ zone:"Wolgur" }).then(response => {
        (response == true) ? enableStart() : testWolgur();
      });
    },100);
  }

  // TODO: Right now we're just enabling the start button as soon as the zone is loaded. In the future this will need
  //       to test to see if the form is valid before actually enabling the button. The testWolgur() function will
  //       probably need to set a flag and this will test that flag and the form values before enabling.
  function enableStart() {
    X.first('#newGame .start-button').setAttribute('class','button send-command start-button');
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
    });

    setTimeout(() => {
      tween.start();
      animate();
    },500);
  }

  return { init, show, fadeIn }

})();