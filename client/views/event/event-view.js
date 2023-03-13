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

    showStage();
  }

  function setTextWindowStyle(fontSize, windowColor) {
    X.first("#eventView .text-container").setAttribute('class',`text-container font-size-${fontSize} window-color-${windowColor}`);
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

  // Currently we always show the normal layout, but as soon as we start
  // adding things like character portraits and such we'll need to get or
  // calculate the layout from the page data.
  function showPage() {
    setLayout('normal-layout',true);
    X.fill('.text-container',buildCurrentTextElement());

    let page = currentPage();
    if (page.background) { BackgroundImage.setBackground(page.background); }
    if (page.filter) { BackgroundImage.setFilter(page.filter); }
  }

  function buildCurrentTextElement() {
    let page = currentPage();

    return X.createElement(`<p class='event-text'>
      ${page.text}
    </p>`)
  }

  function setLayout(layoutClass, showClickAdvance) {
    if ($layout != layoutClass) {
      $layout = layoutClass;

      X.addClass('#eventView .normal-layout','hide');
      X.addClass('#eventView .selection-stage','hide');
      X.removeClass(`#eventView .${layoutClass}`,'hide');

      showClickAdvance ? X.removeClass('#clickAdvance','hide') : X.addClass('#clickAdvance','hide');
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
