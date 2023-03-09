global.EventRenderer = class EventRenderer {

  #code
  #state
  #template
  #context
  #scrutinizer

  constructor(event) {
    this.#code = event.getCode();
    this.#state = event.getState();
    this.#template = EventDictionary.lookup(this.#code);
  }

  createContext() {
    this.#context = Context.forEvent(this.#template, this.#state);

    this.#scrutinizer = new Scrutinizer();
    this.#scrutinizer.setContext(this.#context);
    this.#scrutinizer.setState(this.#state);
  }

  // Event event template may have
  //   repeat: null, true, or requirement value
  //   requires: string or array of requirements
  //   actors: { X:query }
  //   background: code
  //   filter: filter object
  //   stages: stage array
  //   onFinish: function
  render() {
    try {
      this.createContext();

      let stages = ArrayHelper.compact(this.#template.stages.map(stage => {
        if (this.#scrutinizer.meetsRequirements(stage.requires)) {
          return this.renderStage(stage);
        }
      }));

      let rendered = {
        state: this.#state,
        stages: stages,
      };

      if (this.#template.background) { rendered.background = this.#template.background; }
      if (this.#template.filter) { rendered.filter = this.#template.filter; }

      return rendered
    }
    catch(error) {
      console.error(`Error while rendering event`,this.#code);
      throw error;
    }
  }

  // Determine what kind of stage to render.
  renderStage(stage) {
    if (stage.showView) { return stage.showView; }
    if (stage.selectionStage) { return this.renderSelectionStage(stage); }
    return this.renderNormalStage(stage);
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
  renderNormalStage(stage) {
    let pages = ArrayHelper.compact(stage.pages.map(page => {
      if (this.#scrutinizer.meetsRequirements(page.requires)) {
        return this.renderPage(page, stage);
      }
    }));

    let rendered = { pages:pages };

    if (stage.background) { rendered.background = stage.background; }
    if (stage.filter)     { rendered.filter = stage.filter; }
    if (stage.when)       { rendered.when = stage.when; }

    return rendered;
  }

  // Page object may have
  //   speaker:speaker object (player, actor, narrator)
  //   background: code
  //   filter: filter object
  //   text: template string
  //   requires: (They are checked when rendering the stage)
  //
  // TODO: Need to implement these speaker objects. The most basic
  //       implementation of this is that the speaker would just change the
  //       color of the text within quotes. Eventually I'd lile to include
  //       character portraits. No emmotions or reactions or anything like that
  //       will be possible though as all the portraits are AI generated.
  //
  renderPage(page, stage) {
    let rendered = { text:Weaver.weave(page.text, this.#context) };

    if (page.background) { rendered.background = page.background; }
    if (page.filter)     { rendered.filter = page.filter; }

    return rendered;
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
  renderSelectionStage(stage) {
    throw `TODO: Selection Stage`;
  }
}
