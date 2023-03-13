window.EventView = (function() {

  let $skipActive = false;
  let $skipRate = 100;
  let $eventData;
  let $stageCounter;
  let $pageCounter;
  let $layout;

  function init() {
    X.onClick('#clickAdvance', clickAdvance);
  }

  function show(data) {
    MainContent.show({ path:"client/views/event/event-view.html", classname:'event' }).then(() => {
      $eventData = data.event;
      $layout = null;
      showEvent();
      MainContent.hideCover({ fadeTime:250 });
    });
  }

  function isOpen() {
    return X.first('#eventView') != null;
  }

  function currentStage() {
    return $eventData.stages[$stageCounter];
  }

  function currentPage() {
    return currentStage().pages[$pageCounter];
  }

  // === Show Page =============================================================

  function showEvent() {
    $stageCounter = 0;
    $pageCounter = 0;

    setTextWindowStyle(Options.fontSize, Options.windowColor)
    if ($eventData.background) { BackgroundImage.setBackground($eventData.background); }
    if ($eventData.filter) { BackgroundImage.setFilter($eventData.filter); }

    X.first('#eventView .player-speaking .portrait').style['background-image'] = `url('../assets/${$eventData.player.portrait}.jpg')`;

    showStage();
  }

  function setTextWindowStyle(fontSize, windowColor) {
    X.each("#eventView .text-container", container => {
      container.setAttribute('class',`text-container font-size-${fontSize} window-color-${windowColor}`);
    });
  }

  function showStage() {
    let stage = currentStage();

    if (stage.background) { BackgroundImage.setBackground(stage.background); }
    if (stage.filter) { BackgroundImage.setFilter(stage.filter); }

    if (stage.pages) { return showPage(); }
    if (stage.selectionStage) { return renderSelectionStage(); }

    console.error(`How do I render this stage?`);
    console.error(stage);
    throw `TODO: Implement whatever this is.`
  }

  function setLayout(layoutClass, showClickAdvance) {
    if ($layout != layoutClass) {
      $layout = layoutClass;

      X.each('#eventView .text-container', element => {
        element.innerHTML = '';
      });

      X.addClass('#eventView .normal-layout','hide');
      X.addClass('#eventView .player-speaking','hide');
      X.addClass('#eventView .character-speaking','hide');
      X.addClass('#eventView .selection-stage','hide');

      X.addClass('#eventView .selection-stage','hide');
      X.removeClass(`#eventView .${layoutClass}`,'hide');

      showClickAdvance ? X.removeClass('#clickAdvance','hide') : X.addClass('#clickAdvance','hide');
    }
  }

  // === Page Rendering ========================================================

  function showPage() {
    let page = currentPage();
    let speakerLabel = buildSpeakerLabel(page.speaker);
    let attributeCheck = buildAttributeCheckElement(page);

    updateLayout(page);

    let container = X.first(`#eventView .${$layout} .text-container`);
        container.innerHTML = '';

    if (speakerLabel) { container.appendChild(speakerLabel); }
    if (attributeCheck) { container.appendChild(attributeCheck); }
    container.appendChild(X.createElement(`<p class='event-text'>${page.text}</p>`));

    if (page.background) { BackgroundImage.setBackground(page.background); }
    if (page.filter) { BackgroundImage.setFilter(page.filter); }
  }

  function updateLayout(page) {
    if (page.speaker == 'player') {
      setLayout('player-speaking',true);
      return;
    }
    if (page.speaker) {
      setLayout('character-speaking',true);
      updateSpeaker(page.speaker);
      return;
    }
    setLayout('normal-layout',true);
  }

  function updateSpeaker(code) {
    let speaker = $eventData.speakers[code];
    let portrait = X.first(`#eventView .${$layout} .portrait`);
    portrait.style['background-image'] = `url('../assets/${speaker.portrait}.jpg')`;
  }

  function buildSpeakerLabel(code) {
    if (code) {
      let name = (code == 'player') ? $eventData.player.name : $eventData.speakers[code].label;
      return name ? X.createElement(`<div class='speaker-label'>${name}</div>`) : null;
    }
  }

  function buildAttributeCheckElement(page) {
    if (page.attributeCheck) {
      const checks = X.createElement(`<ul class='attribute-checks'></ul>`);

      ObjectHelper.each(page.attributeCheck, (checkCode, checkBranch) => {
        const checkState = $eventData.state[checkCode];
        const attrName = AttributeLabels[checkState.attribute];
        const attr = TextHelper.titlecase(checkState.attribute);

        checks.appendChild(X.createElement(`
          <li class='success-${checkBranch}'>
            ${attrName} Check
            <span class='math'>
              ${attr}(${checkState.bonus}) Roll(${checkState.roll}) = Total(${checkState.total})
            </span>
            <span class='outcome'>${checkState.success ? "Success!" : "Failure"}</span>
          </li>`));
      });

      return checks;
    }
  }

  // === Next Page and Skip Page ===============================================

  function clickAdvance(e) {
    $skipActive = false;
    nextPage();
  }

  function activateSkip() {
    $skipActive = true;
    doSkip();
  }

  function stopSkip() {
    $skipActive = false;
  }

  // TODO: Skipping needs to stop if an unread page or a selection page has
  //       been reached.
  function doSkip() {
    setTimeout(()=>{
      if ($skipActive) {
        nextPage();
        doSkip();
      }
    },$skipRate);
  }

  function nextStage() {
    $stageCounter += 1;
    $pageCounter = 0;

    let isValid = true;
    let stage = currentStage();

    if (stage == null) {
      return endEvent();
    }

    if (stage.when) {
      ObjectHelper.each(stage.when, (key,value) => {
        if ($eventData.state[key] != value) { isValid = false; }
      });
    }

    (isValid) ? showStage() : nextStage()
  }

  function nextPage() {
    if (currentStage().pages && $pageCounter < currentStage().pages.length-1) {
      $pageCounter += 1;
      showPage();
    } else {
      nextStage();
    }
  }

  function endEvent() {
    MainContent.clear();
    ClientCommands.send('game.end-event',$eventData.state);
  }

  // === Selection Stage =======================================================

  function renderSelectionStage() {
    setLayout('selection-stage',false);

    const stage = currentStage();
    const key = stage.selectionStage;
    const header = X.first('#eventView .selection-stage .header');
    const buttons = X.first('#eventView .selection-stage .selection-buttons');

    if (stage.selectionHeader) {
      X.removeClass(header,'hide');
      header.innerHTML = stage.selectionHeader;
    } else {
      X.addClass(header,'hide');
      header.innerHTML = '';
    }

    stage.selections.forEach(selection => {
      buttons.appendChild(buildSelectionButton(selection,key));
    });
  }

  function buildSelectionButton(selection,key) {
    let button = X.createElement(`<a href='#' class='button button-big'>${selection.label}</a>`);
    button.addEventListener('click', event => {
      $eventData.state[key] = selection.value;
      nextStage();
    });

    if (selection.effects) {
      throw `TODO: Add effects to selection buttons`;
    }

    return button;
  }

  return {
    init,
    show,
    isOpen,
    setTextWindowStyle,
  }

})();
