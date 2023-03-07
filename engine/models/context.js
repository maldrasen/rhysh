global.Context = class Context {

  #properties;

  constructor(properties={}) {
    this.#properties = properties;
  }

  getProperties() { return this.#properties; }
  get(key) { return this.#properties[key]; }
  set(key, value) { this.#properties[key] = value; }

  // Get all characters except for the main character. In order for this to
  // work characters should only be referenced by single letter keys. The
  // letter 'P' is reserved for the Main player character.
  getCharacters() {
    return ObjectHelper.select(this.#properties, key => key.length == 1 && key != 'P');
  }

  // One of the main purposes of the WeaverContent is to lookup properties on
  // the actors in order to fill in the template values. Actors can be set on
  // either the event or on the event state.
  static forEvent(template, state) {
    const context = new Context({
      eventState: state,
    });

    if (template.actors || state.characters) {
      throw "TODO: Add actors in Context";
    }
  }

}
