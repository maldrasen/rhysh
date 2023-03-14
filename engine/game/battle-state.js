global.BattleState = class BattleState {

  #roundCounter;
  #monsterCounter;
  #squadCounter;

  #monsters;
  #squads;

  constructor(options) {
    this.#roundCounter = 0;
    this.#monsterCounter = 1;
    this.#squadCounter = 1;
    this.#monsters = {};
    this.#squads = {};

    new MonsterBuilder(this, options).generate();

    CharacterLibrary.eachActivePartyMember((position, character) => {
      character.onBattleStart();
    });
  }

  getRoundNumber() { return this.#roundCounter; }
  getMonsters() { return this.#monsters; }
  getMonster(id) { return this.#monsters[id]; }

  // Add a squad of monsters to the battle. The battle state needs to make a
  // squad, assign it an id, and assign each monster a unique id for the
  // battle.
  addSquad(rank, monsters, name) {
    if (rank < 1 || rank > 5) { throw `Rank is an integer between 1 and 5, not ${rank}`; }

    monsters.forEach(monster => {
      monster.setID(`M${this.#monsterCounter++}`);
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

  getMonsterRange(id) {
    let monsterRange;

    ObjectHelper.each(this.#squads, (key,squad) => {
      squad.monsters.forEach(monster => {
        if (monster.getID() == id) {
          monsterRange = this.getSquadRange(key);
        }
      });
    });

    if (monsterRange == null) {
      throw `No monster with id(${id}) found in squads.`;
    }

    return monsterRange;
  }

  getSquadRange(key) {
    let squad = this.#squads[key];
    if (squad.rank == 1) { return 'close'; }
    if (squad.rank == 2) { return 'extended'; }
    return 'long';
  }

  // Squads can be referenced by number or string in the format 'rank-#'
  getRank(rank) {
    let rankNumber = (typeof rank == 'string') ? parseInt(rank.match(/rank-(\d)/)[1]) : rank;
    let correctSquad;

    ObjectHelper.each(this.#squads, (key,squad) => {
      if (squad.rank == rankNumber) { correctSquad = squad; }
    });

    return correctSquad;
  }

  // === Combat ================================================================

  // At the start of each round we reduce all cooldowns. Probably some other
  // things as well.
  startRound() {
    this.#roundCounter += 1

    ObjectHelper.each(this.#monsters, (id, monster) => {
      monster.reduceCooldowns();
    });

    CharacterLibrary.eachActivePartyMember((position, character) => {
      character.reduceCooldowns();
    });
  }


  // At the end of every round we need to check all the temporary effects and
  // remove the ones that expire. There will be battle wide effects, squad
  // effects and individual character effects, so they all need to be checked.
  //
  // TODO: Swapping Ranks. Like Wizardry, it's possible for monster squads to
  //       move closer or further away. Monsters will try to retreat if they've
  //       been wounded or if enough of them have bad conditions. Monsters in
  //       the back ranks will attempt to heal, buff others, or use ranged
  //       attacks and magic. Some types of monsters prefer to be in the back.
  //       We'll need to have a monster AI that will be able to decide what
  //       rank each squad prefers to be in. With 5 ranks possible the ranges
  //       are: [close, extended, long, long, long];
  //
  endRound() {}

  // === For Client ============================================================
  // Because the battlestate is transferred to the view it needs to be
  // completely packed. This includes a partial packing of the player,
  // companions, and all the monsters, only including the information needed
  // for display in the battle UI.

  pack() {
    return {
      roundCounter: this.#roundCounter,
      party: this.packParty(),
      monsters: this.packMonsters(),
    };
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
