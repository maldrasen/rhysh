window.NewGame = (function() {

  const SexMapping = {
    knight:     ['male'],
    slaver:     ['male','female','futa'],
    cultist:    ['male','female','futa'],
    mindbender: ['male','female','futa'],
    dominatrix: ['female','futa'],
    chosen:     ['male','futa'],
  };

  const SpeciesMapping = {
    knight:     ['elf','orc','minotaur','dragonkind','lupin','satyr'],
    slaver:     ['elf','orc','lupin','satyr'],
    cultist:    ['elf','nymph','dragonkind','satyr'],
    mindbender: ['elf','nymph','dragonkind','satyr'],
    dominatrix: ['elf','nymph','orc','dragonkind','lupin','satyr'],
    chosen:     ['elf','orc','minotaur','dragonkind','lupin','satyr'],
  };

  let selectedArchitype = 'knight';
  let selectedSex = 'male';
  let selectedSpecies = 'elf';

  function init() {
    X.onClick('#newGame .architypes .button', e => { selectArchitype(e.target); });
    X.onClick('#newGame .sexes .button', e => { selectSex(e.target); });
    X.onClick('#newGame .species .button', e => { selectSpecies(e.target); });
    X.onClick('#newGame .choose-architype-button', e => { showSpeciesStep(); });
    X.onClick('#newGame .back-to-architype-button', e => { showArchitypeStep(); });
  }

  function show() {
    MainContent.show({ path:"client/views/mainMenu/new-game.html", classname:'new-game', background:'new-game-1' }).then(() => {
      MainContent.hideCover({ fadeTime:500 });
    });
  }

  function selectArchitype(target) {
    let name = X.classesExcept(target, ['button','selected'])[0];
    if (name == selectedArchitype) { return; }

    X.removeClass('.architypes .selected','selected');
    X.addClass(`.descriptions .${selectedArchitype}`,'hide');
    X.addClass(target,'selected');
    X.removeClass(`.descriptions .${name}`,'hide');

    let allowedSexes = SexMapping[name];
    let allowedSpecies = SpeciesMapping[name];

    selectedArchitype = name;
    selectedSex = allowedSexes[0];
    selectedSpecies = allowedSpecies[0];
  }

  function selectSex(target) {
    let name = X.classesExcept(target, ['button','selected'])[0];
    if (name == selectedSex) { return; }

    X.removeClass('.sexes .selected','selected');
    X.addClass(target,'selected');

    selectedSex = name;
    updateSpeciesImages();

    // If a nymph is selected and we change the sex to male we reset the
    // species back to elf.
    if (selectedSpecies == 'nymph' && selectedSex == 'male') {
      X.removeClass('.species .nymph','selected');
      X.addClass('.species .elf','selected');
      selectedSpecies = 'elf';
    }

    // Likewise if a minotaur is selected and we change the sex to something
    // other than male we reset the species back to elf.
    if (selectedSpecies == 'minotaur' && selectedSex != 'male') {
      X.removeClass('.species .minotaur','selected');
      X.addClass('.species .elf','selected');
      selectedSpecies = 'elf';
    }

  }

  function selectSpecies(target) {
    let name = X.classesExcept(target, ['button','selected'])[0];
    if (name == selectedSpecies) { return; }

    X.removeClass('.species .selected','selected');
    X.addClass(target,'selected');

    selectedSpecies = name;
  }

  function showArchitypeStep()  {
    X.addClass('.species-step','hide');
    X.addClass('.back-to-architype-button','hide');
    X.removeClass('.architype-step','hide');
  }

  function showSpeciesStep() {
    X.addClass('.architype-step','hide');
    X.removeClass('.species-step','hide');
    X.removeClass('.back-to-architype-button','hide');

    X.each('.species-step .sexes a.button', button => {
      X.removeClass(button,'selected');
      X.removeClass(button,'hide');
    });

    X.each('.species-step .species a.button', button => {
      X.removeClass(button,'selected');
      X.removeClass(button,'hide');
    });

    X.each('.species-step .sexes a.button', button => {
      let name = X.classesExcept(button, ['button','selected'])[0];
      if (false == ArrayHelper.contains(SexMapping[selectedArchitype], name)) {
        X.addClass(button,'hide');
      }
    });

    X.each('.species-step .species a.button', button => {
      let name = X.classesExcept(button, ['button','selected'])[0];
      if (false == ArrayHelper.contains(SpeciesMapping[selectedArchitype], name)) {
        X.addClass(button,'hide');
      }
    });

    X.addClass(`.species-step .sexes a.${selectedSex}`,'selected');
    X.addClass(`.species-step .species a.${selectedSpecies}`,'selected');

    updateSpeciesImages();
  }

  function updateSpeciesImages() {
    X.each('.species-step .species a', button => {
      X.removeClass(button, 'male');
      X.removeClass(button, 'female');
    });

    X.each('.species-step .species a', button => {
      X.addClass(button, (selectedSex == 'male') ? 'male' : 'female');
    });

    // Nymphs and minotaurs are special cases because there are only male
    // minotaurs and no male nymphs.
    if (selectedSex == 'male') {
      X.addClass('.species a.nymph','hide');
    } else if (ArrayHelper.contains(SpeciesMapping[selectedArchitype], 'nymph')) {
      X.removeClass('.species a.nymph','hide');
    }

    if (selectedSex != 'male') {
      X.addClass('.species a.minotaur','hide');
    } else if (ArrayHelper.contains(SpeciesMapping[selectedArchitype], 'minotaur')) {
      X.removeClass('.species a.minotaur','hide');
    }
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