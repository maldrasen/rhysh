global.MonsterBodyPlans = {};

global.MonsterBodyPlan = class MonsterBodyPlan {

  #slots;
  #cockOptions;
  #pussyOptions;
  #titsOptions;

  constructor(options) {
    this.#slots = options.slots;
    this.#cockOptions = options.cock;
    this.#pussyOptions = options.pussy;
    this.#titsOptions = options.tits;
  }

  get slots() { return this.#slots; }

  buildCock(monsterBody) { if (this.#cockOptions) { return "TODO[MONSTER_COCK]"; }}
  buildPussy(monsterBody) { if (this.#pussyOptions) { return "TODO[MONSTER_PUSSY]"; }}
  buildTits(monsterBody) { if (this.#titsOptions) { return "TODO[MONSTER_TITS]"; }}
}

MonsterBodyPlans.Humanoid = new MonsterBodyPlan({
  slots:{ head:1, chest:4, legs:3, hands:1, feet:1 },
  cock: {},   // TODO: Body Part Builder Options?
  pussy: {},  // TODO: Body Part Builder Options?
  tits: {},   // TODO: Body Part Builder Options?
});

MonsterBodyPlans.Crabby = new MonsterBodyPlan({
  slots:{ head:1, back:4, legs:3, claws:2 },
});
