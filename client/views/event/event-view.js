window.EventView = (function() {

  let eventData;
  let stageCounter;
  let pageCounter;


  function show(data) {
    MainContent.show({ path:"client/views/event/event-view.html", classname:'event' }).then(() => {
      eventData = data.event;
      showEvent();
      MainContent.hideCover({ fadeTime:250 });
    });
  }

  function currentStage() {
    return eventData.stages[stageCounter];
  }

  function currentPage() {
    return currentStage().pages[pageCounter];
  }

  function showEvent() {
    stageCounter = 0;

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

  function showPage() {
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



  return {
    show,
  }

})();
