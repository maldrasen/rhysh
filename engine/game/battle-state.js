global.BattleState = class BattleState {

  #roundCounter;
  #monsterCounter;
  #squadCounter;

  #monsters;
  #squads;

  #initiativeOrder;
  #initiativeIndex;

  #orders;
  #resultList;

  constructor(options) {
    this.#roundCounter = 0;
    this.#monsterCounter = 1;
    this.#squadCounter = 1;
    this.#monsters = {};
    this.#squads = {};

    this.#orders = {};
    this.#resultList = [];

    this.#initiativeOrder = [];
    this.#initiativeIndex = 0;

    new MonsterBuilder(this).generate();
  }

  // Add a squad of monsters to the battle. The battle state needs to make a
  // squad, assign it an id, and assign each monster a unique id for the
  // battle.
  addSquad(rank, monsters, name) {
    if (rank < 1 || rank > 5) { throw `Rank is an integer between 1 and 5, not ${rank}`; }

    monsters.forEach(monster => {
      monster.setID(this.#monsterCounter++);
      this.#monsters[monster.getID()] = monster;
    });

    let squad = {
      id: (this.#squadCounter++),
      name: name,
      rank: rank,
      monsters: monsters,
    }

    this.#squads[squad.id] = squad;
  }

  // === Combat Rounds =========================================================

  startNextRound() {
    console.log("=== Start Next Round ===");
  }

  // TODO: Swapping Ranks. Like Wizardry, it's possible for monster squads to
  //       move closer or further away. Monsters will try to retreat if they've
  //       been wounded or if enough of them have bad conditions. Monsters in
  //       the back ranks will attempt to heal, buff others, or use ranged
  //       attacks and magic. Some types of monsters prefer to be in the back.
  //       We'll need to have a monster AI that will be able to decide what
  //       rank each squad prefers to be in. With 5 ranks possible the ranges
  //       are: [close, extended, long, long, long];

  // === For Client ============================================================
  // Because the battlestate is transferred to the view it needs to be
  // completely packed. This includes a partial packing of the player,
  // companions, and all the monsters, only including the information needed
  // for display in the battle UI.

  pack() {
    let state = {
      party: this.packParty(),
      monsters: this.packMonsters(),
    };

    console.log('=== Battle State ===');
    console.log('Main:',state.party.main);
    console.log('Monsters',state.monsters['1'].monsters);

    return state;
  }

  packParty() {
    let party = {};

    ObjectHelper.each(CharacterLibrary.getParty(), (key, character) => {
      party[key] = character ? character.packForBattle() : null;
    });

    return party;
  }

  packMonsters() {
    let monsterSquads = {};

    ObjectHelper.each(this.#squads, (id, squad) => {
      let monsters = squad.monsters.map(monster => {
        return monster.pack();
      });

      monsterSquads[id] = {
        id: squad.id,
        name: squad.name,
        rank: squad.rank,
        monsters: monsters,
      };
    });

    return monsterSquads;
  }

}
