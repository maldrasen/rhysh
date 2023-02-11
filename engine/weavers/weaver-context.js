global.WeaverContext = class WeaverContext {

  constructor(properties={}) {
    this.properties = properties;
  }

  getProperties() { return this.properties; }
  getActors() { return ObjectHelper.select(this.properties, key => key.length == 1 && key != 'P'); }
  get(key) { return this.properties[key]; }
  set(key, value) { this.properties[key] = value; }

  // One of the main purposes of the WeaverContent is to lookup properties on
  // the actors in order to fill in the template values. Actors can be set on
  // either the event or on the event state.
  static async forEvent(template, state) {

    const context = new WeaverContext({
      eventState: state,
    });

    if (template.actors || state.characters) {
      throw "TODO: Add actors in WeaverContext";
    }

    // Actors will have a key and a query for the character library and need to
    // be looked up before they can be used.
    //   { A:{ partyMember:true, sex:'female' }}
    // await Promise.all(Object.keys(event.actors||[]).map(async key => {
    //   await this.addActor(key, event.actors[key]);
    // }));

    // Characters will already have their codes and can be added directly.
    // await Promise.all(Object.keys(state.actors||[]).map(async key => {
    //   await this.addCharacter(key, (await Character.lookup(state.actors[key])));
    // }));

  }

  // async addActor(key, query) {
  //   const character = await CharacterLibrary.findCharacter(query);
  //   if (character) {
  //     await this.addCharacter(key, character);
  //   }
  // }

  // async addCharacter(key, character) {
  //   if (key.length != 1) { throw `Actors in the context should have a single letter key.`; }
  //   const everything = await character.getCompleteBody();
  //         everything.body.weight = await everything.body.getWeight();
  //   this.set(key, extend(everything, { character:character }));
  // }

}
