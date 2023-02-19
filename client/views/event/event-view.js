window.EventView = (function() {

  let skipActive = false;
  let skipRate = 100;
  let eventData;
  let stageCounter;
  let pageCounter;

  function init() {
    X.onClick('#eventView .click-advance', clickAdvance);
  }

  function show(data) {
    MainContent.show({ path:"client/views/event/event-view.html", classname:'event' }).then(() => {
      eventData = data.event;
      showEvent();
      MainContent.hideCover({ fadeTime:250 });
    });
  }

  function isOpen() {
    return X.first('#eventView') != null;
  }

  function currentStage() {
    return eventData.stages[stageCounter];
  }

  function currentPage() {
    return currentStage().pages[pageCounter];
  }

  // === Show Page =============================================================

  function showEvent() {
    stageCounter = 0;

    X.first("#eventView").setAttribute('class',`font-size-${Options.fontSize}`);

    if (eventData.background) { BackgroundImage.setBackground(eventData.background); }
    if (eventData.filter) { BackgroundImage.setFilter(eventData.filter); }

    showStage();
  }

  function showStage() {
    pageCounter = 0;

    let stage = currentStage();

    if (stage.background) { BackgroundImage.setBackground(stage.background); }
    if (stage.filter) { BackgroundImage.setFilter(stage.filter); }

    showPage();
  }

  // The click-advance should only advance normal pages. If this is a selection
  // stage or some other view we should hide the click advance when the page is
  // rendered.
  function showPage() {
    X.fill('.text-container',buildCurrentTextElement());
    X.removeClass('.click-advance','hide');

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

  // === Next Page and Skip Page ===============================================

  function clickAdvance(e) {
    skipActive = false;
    nextPage();
  }

  function activateSkip() {
    skipActive = true;
    doSkip();
  }

  function stopSkip() {
    skipActive = false;
  }

  function doSkip() {
    setTimeout(()=>{
      if (skipActive) {
        nextPage();
        doSkip();
      }
    },skipRate);
  }

  // TODO: This will need to validate pages and skip past stages and pages that
  //       have a when property set without matching values in the event state.
  //
  function nextPage() {
    if (currentStage().pages && pageCounter < currentStage().pages.length-1) {
      pageCounter += 1;
      showPage();
    } else {
      stageCounter += 1;
      (currentStage() == null) ? endEvent() : showStage();
    }
  }

  function endEvent() {
    MainContent.clear();
    ClientCommands.send('game.end-event',eventData.state);
  }

  return {
    init,
    show,
    isOpen,
  }

})();
