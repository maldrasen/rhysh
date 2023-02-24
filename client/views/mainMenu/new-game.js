window.NewGame = (function() {

  let selectedArchetype;
  let selectedSex;
  let selectedSpecies;
  let attributeControl;
  let attributes;
  let randomNames;

  function init() {
    X.onClick('#newGame .archetypes .button', e => { handleSelectArchetype(e.target); });
    X.onClick('#newGame .sexes .button', e => { handleSelectSex(e.target); });
    X.onClick('#newGame .species .button', e => { handleSelectSpecies(e.target); });

    X.onClick('#newGame .choose-archetype-button', e => { showSpeciesStep(); });
    X.onClick('#newGame .choose-species-button', e => { showSummaryStep(); });
    X.onClick('#newGame .begin-button', e => { beginGame(); });

    X.onClick('#newGame .back-to-main-button', e => { backToMain(); });
    X.onClick('#newGame .back-to-archetype-button', e => { showArchetypeStep(); });
    X.onClick('#newGame .back-to-species-button', e => { showSpeciesStep(); });

    X.onInput('#newGame input', e => { setTimeout(validateForm, 1); });
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

      ClientCommands.send('game.get-random-names').then((names) => {
        randomNames = names;
      });
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
    let archetype = ArchetypeDictionary.lookup(name);

    X.removeClass('.archetype-step .archetypes .selected','selected');
    X.addClass(button,'selected');

    selectedArchetype = name;
    selectedSex = archetype.availableSexes[0];
    selectedSpecies = archetype.availableSpecies[0];

    showArchetypeDescription();
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

    selectedSpecies = name;

    showSpeciesDescription();
  }

  function showArchetypeStep()  {
    hideAll()

    X.removeClass('.archetype-step','hide');
    X.removeClass('.back-to-main-button','hide');
    X.removeClass('.choose-archetype-button','hide');

    showArchetypeDescription();
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
      if (false == ArrayHelper.contains(ArchetypeDictionary.lookup(selectedArchetype).availableSexes, name)) {
        X.addClass(button,'hide');
      }
    });

    X.each('.species-step .species a.button', button => {
      let name = X.classesExcept(button, ['button','selected'])[0];
      if (false == ArrayHelper.contains(ArchetypeDictionary.lookup(selectedArchetype).availableSpecies, name)) {
        X.addClass(button,'hide');
      }
    });

    X.addClass(`.species-step .sexes a.${selectedSex}`,'selected');
    X.addClass(`.species-step .species a.${selectedSpecies}`,'selected');

    updateSpeciesImages();
    showSpeciesDescription();
  }

  function showSummaryStep() {
    hideAll();

    let baseAttributes = {};
    let attributeBase = SpeciesDictionary.lookup(selectedSpecies).basePlayerAttributes;
    let attributeBonus = ArchetypeDictionary.lookup(selectedArchetype).attributeBonus;
    let firstNameInput = X.first('input#firstName');
    let lastNameInput = X.first('input#lastName');

    if (firstNameInput.value == '') {
      firstNameInput.value = randomNames[selectedSex].first.name
      lastNameInput.value = randomNames[selectedSex].last.name
    }

    ObjectHelper.each(attributeBase, name => {
      baseAttributes[name] = attributeBase[name];
      if (attributeBonus[name]) { baseAttributes[name] += attributeBonus[name]; }
      if (Random.flipCoin()) { baseAttributes[name] -= 1; }
      if (Random.flipCoin()) { baseAttributes[name] += 1; }
    });

    X.removeClass('.summary-step','hide');
    X.removeClass('.back-to-species-button','hide');
    X.removeClass('.begin-button','hide');

    attributeControl = new AttributeControl();
    attributeControl.setAttributes(baseAttributes);
    attributes = baseAttributes;

    X.fill('.attributes-container',attributeControl.getElement());

    updateSummary();
  }

  function updateSpeciesImages() {
    let availableSpecies = ArchetypeDictionary.lookup(selectedArchetype).availableSpecies;

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

  function showArchetypeDescription() {
    X.addClass(`.archetype-step .descriptions > div`,'hide');
    X.removeClass(`.archetype-step .descriptions .${selectedArchetype}`,'hide');
  }

  function showSpeciesDescription() {
    X.addClass(`.species-step .descriptions > div`,'hide');
    X.removeClass(`.species-step .descriptions .${selectedSpecies}`,'hide');
  }

  // Called between steps to hide all the other steps and buttons.
  function hideAll() {
    X.addClass('.archetype-step','hide');
    X.addClass('.species-step','hide');
    X.addClass('.summary-step','hide');

    X.addClass('.back-to-main-button','hide');
    X.addClass('.back-to-archetype-button','hide');
    X.addClass('.back-to-species-button','hide');

    X.addClass('.choose-archetype-button','hide');
    X.addClass('.choose-species-button','hide');
    X.addClass('.begin-button','hide');
  }

  function updateSummary() {
    let archetype = ArchetypeDictionary.lookup(selectedArchetype);
    let attributeList = X.first('.summary .attribute-list');

    X.empty(attributeList);
    X.addClass('.summary .archetype-list','hide');
    X.addClass('.summary .species-list','hide');
    X.removeClass(`.summary .${selectedArchetype}-archetype-list`,'hide');
    X.removeClass(`.summary .${selectedSpecies}-species-list`,'hide');

    const addSummaryItem = function(string) {
      attributeList.appendChild(X.createElement(`<li>${string}</li>`));
    }

    addSummaryItem('The player character is an exemplar of their species with higher than average attributes.');
    addSummaryItem(`<div class='small-margin-top'>A ${archetype.name} receives the following attribute bonuses:</div>`);

    ObjectHelper.each(archetype.attributeBonus, attr => {
      addSummaryItem(`<span class='sub bonus'>${AttributeNames[attr]} +${archetype.attributeBonus[attr]}</span>`);
    });
  }

  function validateForm() {
    let beginButton = X.first('#newGame .begin-button');

    if (X.hasClass(beginButton,'disabled') && isFormValid()) {
      console.log("ENABLE")
      X.removeClass(beginButton, 'disabled');
    }

    if (!X.hasClass(beginButton,'disabled') && !isFormValid()) {
      console.log("DISABLE")
      X.addClass(beginButton, 'disabled');
    }
  }

  function isFormValid() {
    if (!X.first('input#firstName').value.match(/\w+/)) { return false; };
    if (!X.first('input#lastName').value.match(/\w+/)) { return false; };
    return true;
  }

  function beginGame() {
    let parameters = {
      archetype: selectedArchetype,
      species: selectedSpecies,
      sex: selectedSex,
      firstName: X.first('input#firstName').value,
      lastName: X.first('input#lastName').value,
      attributes: attributes,
    };

    ClientCommands.send('game.start', parameters).then(() => {
      MainContent.clear();
    });
  }

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