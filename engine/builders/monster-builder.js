global.MonsterBuilder = class MonsterBuilder {

  #battleState;

  constructor(battleState) {
    this.#battleState = battleState;
  }

  // TODO: Eventually this will need to read data from the current zone and
  //       possibly from the region within the zone. This should give us a list
  //       of possible encounter formations that we then use to generate the
  //       monsters. That might be a bit far out still, for now we can just
  //       generate goblins or mudcrabs.
  generate() {
    (Random.roll(6) < 4) ? this.tempMudcrabs() : this.tempGoblins();
  }

  tempMudcrabs() {
    forUpTo((Random.roll(4)+1), i => {
      let crabs = [];
      let count = Random.roll(2) + 4;

      forUpTo(count, i => {
        crabs.push(new Monster.Mudcrab({}));
      });

      this.#battleState.addSquad(i+1,crabs,"Mudcrabs");
    });
  }

  tempGoblins() {
    forUpTo((Random.roll(4)+1), i => {
      let gobbos = [];
      let count = Random.roll(2) + 3;

      for (let i=0; i<count; i++) {
        gobbos.push(new Monster.Goblin({}));
      }

      this.#battleState.addSquad(i+1,gobbos,"Goblins");
    });
  }

}
