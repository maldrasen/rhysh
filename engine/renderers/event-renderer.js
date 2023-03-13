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

  // Format:
  //   attributeChecks:{
  //     lookSexy:{
  //       who:'A',          - If null defaults to player, or is the actor key.
  //       attribute:'cha',  - Attribute to check
  //       target:14         - Target value.
  //     }
  //   }
  runAttributeChecks() {
    let checks = this.#template.attributeChecks;
    if (checks) {
      ObjectHelper.each(checks, (code,check) => {
        let actor = check.who ? this.lookupActor(check.who) : CharacterLibrary.getMainCharacter();
        let roll = Random.rollDice({ d:20 });
        let bonus = actor.getAttributes().getModifier(check.attribute);
        let total = roll + bonus;

        this.#state[code] = {
          attribute: check.attribute,
          target: check.target,
          roll: roll,
          bonus: bonus,
          total: total,
          success: (total >= check.target),
        }
      });
    }
  }

  // Event event template may have
  //   repeat: null, true, or requirement value
  //   requires: string or array of requirements
  //   actors: { X:query }
  //   speakers: { dude:{ portrait:image, label:name }}
  //   background: code
  //   filter: filter object
  //   stages: stage array
  //   onFinish: function
  //   attributeChecks: map of attribute checks to make and add to the state.
  render() {
    try {
      const player = CharacterLibrary.getMainCharacter();

      this.createContext();
      this.runAttributeChecks();

      const stages = ArrayHelper.compact(this.#template.stages.map(stage => {
        if (this.#scrutinizer.meetsRequirements(stage.requires)) {
          if (stage.attributeCheck) { console.log('TODO: Check Stage attributeCheck') }
          return this.renderStage(stage);
        }
      }));

      const rendered = {
        state: this.#state,
        stages: stages,
        player: {
          name: player.getStoryName(),
          portrait: player.getPortrait(),
        }
      };

      if (this.#template.background) { rendered.background = this.#template.background; }
      if (this.#template.filter) { rendered.filter = this.#template.filter; }

      // An event can have both actors and speakers. Actors have actual
      // character objects that we reference for the names and portraits
      // whereas speakers only have the name and portrait as set in the event.
      //
      // TODO: When we build the speakers object in the rendered view we need
      //       to add a speaker object { portrait:image, label:name } for each
      //       actor in case we need to render a page with them speaking.
      if (this.#template.speakers) { rendered.speakers = this.#template.speakers; }

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
  //   attributeCheck: { code:boolean },
  //   background: code
  //   filter: filter object
  //   pages:[]
  //
  renderNormalStage(stage) {
    let pages = ArrayHelper.compact(stage.pages.map(page => {
      if (this.#scrutinizer.meetsRequirements(page.requires)) {
        if (page.attributeCheck) { console.log('TODO: Check Page attributeCheck') }
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
  //   speaker: code
  //   filter: filter object
  //   text: template string
  //   requires: (They are checked when rendering the stage)
  //   attributeCheck: { code:boolean },
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
    if (page.speaker)    { rendered.speaker = page.speaker; }

    return rendered;
  }

  // A staple in visual novels, a selection stage shows a single page with
  // multiple choices. The selected choice sets the value of the selectionKey
  // in the event state. Only selections that meet the requirements should be
  // shown. Selections can also have effect badges, letting the player know
  // what kind of concequences a choice might have.
  //
  //    selectionHeader: text,
  //    selectionStage: true,
  //    selectionKey: 'approach',
  //    selections:[
  //      { text:'Befriend {{his}}', value:'befriend' },
  //      { text:'Torment {{him}}',  value:'torment',  effects:['player sadist 1']},
  //      { text:'Fuck {{him}}',     value:'torment',  requires:'player.has-cock'},
  //    ]
  //
  renderSelectionStage(stage) {
    let selections = [];

    stage.selections.forEach(selection => {
      if (this.#scrutinizer.meetsRequirements(selection.requires)) {
        selections.push({
          label: Weaver.weave(selection.text, this.#context),
          value: selection.value,
          effects: selection.effects,
        });
      }
    });

    return {
      selectionStage: stage.selectionKey,
      selectionHeader: Weaver.weave(stage.selectionHeader, this.#context),
      selections: selections,
    };
  }
}
