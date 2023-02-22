global.BattleState = class BattleState {

  #ranks = {};

  constructor(options) {
    new MonsterBuilder(this).generate();
  }

  setRank(rank, monsters) {
    if (rank < 1 || rank > 5) { throw `Rank is an integer between 1 and 5, not ${rank}` }
    this.#ranks[rank] = monsters;
  }

  // Because the battlestate is transferred to the view it needs to be
  // completely packed. This includes a partial packing of the player,
  // companions, and all the monsters, only including the information needed
  // for display in the battle UI.

  pack() {
    let state = {
      ranks: {},
    };

    ObjectHelper.each(this.#ranks, (index, monsters) => {
      state.ranks[index] = this.#ranks[index].map(monster => {
        return monster.pack();
      });
    });

    console.log("PACKED:",state);

    return state;
  }

}
