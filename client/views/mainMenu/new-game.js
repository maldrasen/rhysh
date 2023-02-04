window.NewGame = (function() {

  let selectedArchetype;
  let selectedSex;
  let selectedSpecies;
  let attributeControl;

  function init() {
    X.onClick('#newGame .archetypes .button', e => { handleSelectArchetype(e.target); });
    X.onClick('#newGame .sexes .button', e => { handleSelectSex(e.target); });
    X.onClick('#newGame .species .button', e => { handleSelectSpecies(e.target); });

    X.onClick('#newGame .choose-archetype-button', e => { showSpeciesStep(); });
    X.onClick('#newGame .choose-species-button', e => { showAttributeStep(); });

    X.onClick('#newGame .back-to-main-button', e => { backToMain(); });
    X.onClick('#newGame .back-to-archetype-button', e => { showArchetypeStep(); });
    X.onClick('#newGame .back-to-species-button', e => { showSpeciesStep(); });
  }

  function backToMain() {
    ClientCommands.send("game.abort");
    MainMenu.show();
  }

  function show() {
    MainContent.show({ path:"client/views/mainMenu/new-game.html", classname:'new-game', background:'new-game-1' }).then(() => {
      selectedArchetype = 'knight';
      selectedSex = 'male';
      selectedSpecies = 'elf';

      showArchetypeStep();
      MainContent.hideCover({ fadeTime:500 });
    });
  }

  function handleSelectArchetype(target) {
    let name = X.classesExcept(target, ['button','selected'])[0];
    if (name != selectedArchetype) { selectArchetype(name); }
  }

  function handleSelectSex(target) {
    let name = X.classesExcept(target, ['button','selected'])[0];
    if (name != selectedSex) { selectSex(name); }
  }

  function handleSelectSpecies(target) {
    let name = X.classesExcept(target, ['button','selected'])[0];
    if (name != selectedSpecies) { selectSpecies(name); }
  }

  function selectArchetype(name) {
    let button = X.first(`.archetypes a.${name}`);
    X.removeClass('.archetype-step .archetypes .selected','selected');
    X.addClass(button,'selected');

    X.addClass(`.archetype-step .descriptions .${selectedArchetype}`,'hide');
    X.removeClass(`.archetype-step .descriptions .${name}`,'hide');

    selectedArchetype = name;
    selectedSex = ArchetypeData[name].availableSexes[0];
    selectedSpecies = ArchetypeData[name].availableSexes[0];
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

  function showArchetypeStep()  {
    hideAll()

    X.removeClass('.archetype-step','hide');
    X.removeClass('.back-to-main-button','hide');
    X.removeClass('.choose-archetype-button','hide');
  }

  function showSpeciesStep() {
    hideAll()

    X.removeClass('.species-step','hide');
    X.removeClass('.back-to-archetype-button','hide');
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
      if (false == ArrayHelper.contains(ArchetypeData[selectedArchetype].availableSexes, name)) {
        X.addClass(button,'hide');
      }
    });

    X.each('.species-step .species a.button', button => {
      let name = X.classesExcept(button, ['button','selected'])[0];
      if (false == ArrayHelper.contains(ArchetypeData[selectedArchetype].availableSexes, name)) {
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
    let attributeData = SpeciesData[selectedSpecies].basePlayerAttributes;

    ObjectHelper.each(attributeData, name => {
      baseAttributes[name] = attributeData[name];
      if (Random.flipCoin()) { baseAttributes[name] -= 1; }
      if (Random.flipCoin()) { baseAttributes[name] += 1; }
    });

    X.removeClass('.attributes-step','hide');
    X.removeClass('.back-to-species-button','hide');
    X.removeClass('.choose-attributes-button','hide');

    attributeControl = new AttributeControl();
    attributeControl.setAttributes(baseAttributes);

    X.fill('.attributes-container',attributeControl.getElement());

    updateSummary();
  }

  function updateSpeciesImages() {
    let availableSpecies = ArchetypeData[selectedArchetype].availableSpecies;

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
    } else if (ArrayHelper.contains(availableSpecies, 'nymph')) {
      X.removeClass('.species a.nymph','hide');
    }

    if (selectedSex != 'male') {
      X.addClass('.species a.minotaur','hide');
    } else if (ArrayHelper.contains(availableSpecies, 'minotaur')) {
      X.removeClass('.species a.minotaur','hide');
    }
  }

  // Called between steps to hide all the other steps and buttons.
  function hideAll() {
    X.addClass('.archetype-step','hide');
    X.addClass('.species-step','hide');
    X.addClass('.attributes-step','hide');

    X.addClass('.back-to-main-button','hide');
    X.addClass('.back-to-archetype-button','hide');
    X.addClass('.back-to-species-button','hide');

    X.addClass('.choose-archetype-button','hide');
    X.addClass('.choose-species-button','hide');
    X.addClass('.choose-attributes-button','hide');
  }

  function updateSummary() {
    let summaryList = X.first('.summary-list');

    X.empty(summaryList);

    summaryList.appendChild(X.createElement(`<li>Character is an exemplar of their species with higher than average attributes.</li>`));
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