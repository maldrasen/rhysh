window.NewGame = (function() {

  // TODO: Perhaps move all of this data into a constants or configuration
  //       file for the species. This might be the only place they're used
  //       though, still it'd be a good practice.

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

  const SpeciesAttributeMapping = {
    elf:        { str:12, dex:14, con:10, int:12, wis:10, cha:10 },
    nymph:      { str:8,  dex:8,  con:8,  int:12, wis:12, cha:16 },
    orc:        { str:14, dex:12, con:16, int:8,  wis:10, cha:8  },
    minotaur:   { str:16, dex:8,  con:14, int:8,  wis:8,  cha:8  },
    dragonkind: { str:14, dex:14, con:12, int:14, wis:12, cha:12 },
    lupin:      { str:14, dex:14, con:16, int:9,  wis:9,  cha:9  },
    satyr:      { str:12, dex:10, con:10, int:8,  wis:8,  cha:12 },
  }

  let selectedArchitype;
  let selectedSex;
  let selectedSpecies;
  let attributeControl;

  function init() {
    X.onClick('#newGame .architypes .button', e => { handleSelectArchitype(e.target); });
    X.onClick('#newGame .sexes .button', e => { handleSelectSex(e.target); });
    X.onClick('#newGame .species .button', e => { handleSelectSpecies(e.target); });

    X.onClick('#newGame .choose-architype-button', e => { showSpeciesStep(); });
    X.onClick('#newGame .choose-species-button', e => { showAttributeStep(); });

    X.onClick('#newGame .back-to-main-button', e => { backToMain(); });
    X.onClick('#newGame .back-to-architype-button', e => { showArchitypeStep(); });
    X.onClick('#newGame .back-to-species-button', e => { showSpeciesStep(); });
  }

  function backToMain() {
    ClientCommands.send("game.abort");
    MainMenu.show();
  }

  function show() {
    MainContent.show({ path:"client/views/mainMenu/new-game.html", classname:'new-game', background:'new-game-1' }).then(() => {
      selectedArchitype = 'knight';
      selectedSex = 'male';
      selectedSpecies = 'elf';

      showArchitypeStep();
      MainContent.hideCover({ fadeTime:500 });
    });
  }

  function handleSelectArchitype(target) {
    let name = X.classesExcept(target, ['button','selected'])[0];
    if (name != selectedArchitype) { selectArchitype(name); }
  }

  function handleSelectSex(target) {
    let name = X.classesExcept(target, ['button','selected'])[0];
    if (name != selectedSex) { selectSex(name); }
  }

  function handleSelectSpecies(target) {
    let name = X.classesExcept(target, ['button','selected'])[0];
    if (name != selectedSpecies) { selectSpecies(name); }
  }

  function selectArchitype(name) {
    let button = X.first(`.architypes a.${name}`);
    X.removeClass('.architype-step .architypes .selected','selected');
    X.addClass(button,'selected');

    X.addClass(`.architype-step .descriptions .${selectedArchitype}`,'hide');
    X.removeClass(`.architype-step .descriptions .${name}`,'hide');

    let allowedSexes = SexMapping[name];
    let allowedSpecies = SpeciesMapping[name];

    selectedArchitype = name;
    selectedSex = allowedSexes[0];
    selectedSpecies = allowedSpecies[0];
  }

  function selectSex(name) {
    let button = X.first(`.sexes a.${name}`);

    X.removeClass('.sexes .selected','selected');
    X.addClass(button,'selected');

    selectedSex = name;
    updateSpeciesImages();

    if (selectedSpecies == 'nymph' && selectedSex == 'male') { selectSpecies('elf'); }
    if (selectedSpecies == 'minotaur' && selectedSex != 'male') { selectSpecies('elf'); }
  }

  function selectSpecies(name) {
    let button = X.first(`.species a.${name}`);

    X.removeClass('.species .selected','selected');
    X.addClass(button,'selected');

    X.addClass(`.species-step .descriptions .${selectedSpecies}`,'hide');
    X.removeClass(`.species-step .descriptions .${name}`,'hide');

    selectedSpecies = name;
  }

  function showArchitypeStep()  {
    hideAll()

    X.removeClass('.architype-step','hide');
    X.removeClass('.back-to-main-button','hide');
    X.removeClass('.choose-architype-button','hide');
  }

  function showSpeciesStep() {
    hideAll()

    X.removeClass('.species-step','hide');
    X.removeClass('.back-to-architype-button','hide');
    X.removeClass('.choose-species-button','hide');

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

  function showAttributeStep() {
    hideAll();

    let baseAttributes = {};

    ObjectHelper.each(SpeciesAttributeMapping[selectedSpecies], name => {
      baseAttributes[name] = SpeciesAttributeMapping[selectedSpecies][name];
      if (Random.flipCoin()) { baseAttributes[name] -= 1; }
      if (Random.flipCoin()) { baseAttributes[name] += 1; }
    });

    X.removeClass('.attributes-step','hide');
    X.removeClass('.back-to-species-button','hide');
    X.removeClass('.choose-attributes-button','hide');

    attributeControl = new AttributeControl();
    attributeControl.setAttributes(baseAttributes);

    X.first('.attributes-container').replaceChildren(attributeControl.getElement());
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

  // Called between steps to hide all the other steps and buttons.
  function hideAll() {
    X.addClass('.architype-step','hide');
    X.addClass('.species-step','hide');
    X.addClass('.attributes-step','hide');

    X.addClass('.back-to-main-button','hide');
    X.addClass('.back-to-architype-button','hide');
    X.addClass('.back-to-species-button','hide');

    X.addClass('.choose-architype-button','hide');
    X.addClass('.choose-species-button','hide');
    X.addClass('.choose-attributes-button','hide');
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