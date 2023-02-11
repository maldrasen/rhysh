global.EventRenderer = class EventRenderer {

  constructor(code, state) {
    this.template = EventTemplate.lookup(code);
    this.state = state;
    this.stages = [];
  }

  async createContext() {
    this.context = await WeaverContext.forEvent(this.template, this.state);
  }

  // Event event template may have
  //   repeat:
  //   requires: string or array of requirements
  //   actors: { X:query }
  //   background: code
  //   filter: filter object
  //   stages: stage array
  //   onFinish: function
  async render() {
    try {
      await this.createContext();

      this.template.stages.forEach(stage => {
        this.stages.push(this.renderStage(stage));
      });

      return {
        stages: this.stages
      };
    } catch(error) {
      console.error(`Error while rendering event`,this.event);
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
    console.log(" - Stage:",stage)

    let pages = [];
    stage.pages.forEach(page => {
      pages.push(this.renderPage(page, stage));
    })

    return { pages:pages };
  }

  // Page object may have
  //   speaker:speaker object (player, actor, narrator)
  //   background: code
  //   filter: filter object
  //   text:template string
  //
  renderPage(page, stage) {
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
  renderSelectionStage(stage) {
    throw `TODO: Selection Stage`;
  }
}
