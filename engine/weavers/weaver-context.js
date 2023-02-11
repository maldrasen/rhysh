global.WeaverContext = class WeaverContext {

  constructor(properties={}) {
    this.properties = properties;
  }

  getProperties() { return this.properties; }
  getActors() { return ObjectHelper.select(this.properties, key => key.length == 1 && key != 'P'); }

}


// global.Context = class Context {


//   get properties() { return this._properties; }
//   get actors() {  }

//   get(key) { return this._properties[key]; }
//   set(key, value) {
//     this._properties[key] = value;
//   }

//   async setEvent(event) {
//     this._event = event;

//     await this.addGame();
//     await this.addPlayer();
//     await this.addMinionData();

//     await Promise.all(Object.keys(event.actors||[]).map(async key => {
//       await this.addActor(key, event.actors[key]);
//     }));
//   }

//   // Characters can also be added through the event state, for when a
//   // character with a known ID is added to the context.
//   async setEventState(state) {
//     await Promise.all(Object.keys(state.actors||[]).map(async key => {
//       await this.addCharacter(key,(await Character.lookup(state.actors[key])));
//     }));
//   }

//   async addGame() {
//     const game = await Game.instance();
//     this.set('game', game);
//   }

//   async addCharacter(key, character) {
//     if (key.length != 1) { throw `Actors in the context should have a single letter key.`; }

//     const everything = await character.getCompleteBody();
//           everything.body.weight = await everything.body.getWeight();

//     this.set(key, extend(everything, { character:character }));
//   }

//   async addPlayer() {
//     const player = await Player.instance();
//     if (player) {
//       await this.addCharacter('P',player)
//     }
//   }

//   async addActor(key, descriptive) {
//     const character = await CharacterAgent.findActor(descriptive);
//     if (character) {
//       await this.addCharacter(key, character);
//     }
//   }

//   // I don't want to include all the minions in the context, but I still
//   // occationally need various data points, how many minions are doing what,
//   // that sort of thing.
//   async addMinionData() {
//     if (this.get('minionData') != null) { return; }

//     const minions = await Character.findAll();

//     let data = {
//       totalCount: 0,
//       freeCount: 0,
//       missionCount: 0,
//       workingCount: 0,
//       taskCount: 0,
//     }

//     each(minions, minion => {
//       data.totalCount++;
//       if (minion.currentDuty == 'role') { data.freeCount++ }
//       if (minion.currentDuty == 'mission') { data.missionCount++ }
//       if (minion.currentDuty == 'project') { data.workingCount++ }
//       if (minion.currentDuty == 'task') { data.taskCount++ }
//     });

//     this.set('minionData', data);
//   }

// }
