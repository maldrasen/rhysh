global.EventTemplate = (function() {

  let library = {}

  // For now, I think we just store the event as whatever raw data is passed
  // into this. We might need to massage the data later, but there doesn't seem
  // to be any need now to do that.
  function build(code, data) { library[code] = data; }

  function lookup(code) {
    if (library[code] == null) { throw `Unknown Event [${code}]`; }
    return library[code];
  }

  // Given an event state we take an event template and flesh it out, turning
  // it into something that the client can render in the Event view. This will
  // mostly involve.
  //
  // Event event template may have
  //   repeat:
  //   requires: string or array of requirements
  //   actors: { X:query }
  //   background: code
  //   filter: filter object
  //   stages: stage array
  //   onFinish: function
  function render(event) {
    let template = lookup(event.code);
    let state = event.state;
    let stages = [];

    console.log("=== Render Event ===")
    console.log("State:",state)

    try {
      template.stages.forEach(stage => {
        stages.push(renderStage(stage, state));
      });
      return { stages:stages };
    } catch(error) {
      console.error(`Error while rendering event`,event)
      throw error;
    }
  }

  // Determine what kind of stage to render.
  function renderStage(stage, state) {
    if (stage.showView) { return stage.showView; }
    if (stage.selectionStage) { return renderSelectionStage(stage, state); }
    return renderNormalStage(stage, state);
  }

  // Stage object may have
  //   requires: string or array of requirements
  //   when: { key:value }
  //       A when clause only shows stages that match the current event state.
  //       Unlike the requires property which filters out stages before the
  //       event is shown, this is checked real time because the event state
  //       can change inside the event such as after selectionStages. Currently
  //       this only checks to see if a key matches a value. Could be extended
  //       if needed though.
  //   background: code
  //   filter: filter object
  //   pages:[]
  //
  function renderNormalStage(stage, state) {
    console.log(" - Stage:",stage)

    let pages = [];
    stage.pages.forEach(page => {
      pages.push(renderPage(page, stage, state));
    })

    return { pages:pages };
  }

  // Page object may have
  //   speaker:speaker object (player, actor, narrator)
  //   background: code
  //   filter: filter object
  //   text:template string
  //
  function renderPage(page, stage, state) {
    console.log("    - Page:",page)
    return page;
  }

  // A staple in visual novels, a selection stage shows a single page with
  // multiple choices. The selected choice sets the value of the selectionKey
  // in the event state. Only selections that meet the requirements should be
  // shown. Selections can also have effect badges, letting the player know
  // what kind of concequences a choice might have.
  //
  //    selectionStage: true,
  //    selectionKey: 'approach',
  //    selections:[
  //      { text:'Befriend {{his}}', value:'befriend' },
  //      { text:'Torment {{him}}',  value:'torment',  effects:['player sadist 1']},
  //      { text:'Fuck {{him}}',     value:'torment',  requires:'player.has-cock'},
  //    ]
  //
  function renderSelectionStage(stage, state) {
    throw `TODO: Selection Stage`;
  }

  // When an event is finished we need to call this complete method with
  // whatever the end state of the event was. This needs to call the onFinish()
  // function of the event if there is one.
  function complete(state) {

  }

  return {
    build,
    lookup,
    render,
  }

})();