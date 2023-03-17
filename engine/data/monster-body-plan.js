const BodyPlans = {};

global.MonsterBodyPlan = class MonsterBodyPlan {

  static register(power) {
    BodyPlans[power.code] = power;
  }

  static lookup(code) {
    if (BodyPlans[code] == null) { throw `Unknown Body Plan (${code})` }
    return BodyPlans[code];
  }

  #code;
  #slots;
  #cockOptions;
  #pussyOptions;
  #titsOptions;

  constructor(code, options) {
    this.#code = code;
    this.#slots = options.slots;
    this.#cockOptions = options.cock;
    this.#pussyOptions = options.pussy;
    this.#titsOptions = options.tits;
  }

  get code() { return this.#code; }
  get slots() { return this.#slots; }

  buildCock(monsterBody) { if (this.#cockOptions) { return "TODO[MONSTER_COCK]"; }}
  buildPussy(monsterBody) { if (this.#pussyOptions) { return "TODO[MONSTER_PUSSY]"; }}
  buildTits(monsterBody) { if (this.#titsOptions) { return "TODO[MONSTER_TITS]"; }}
}

MonsterBodyPlan.register(new MonsterBodyPlan('humanoid',{
  slots:{ head:1, chest:4, legs:3, hands:1, feet:1 },
  cock: {},   // TODO: Body Part Builder Options?
  pussy: {},  // TODO: Body Part Builder Options?
  tits: {},   // TODO: Body Part Builder Options?
}));

MonsterBodyPlan.register(new MonsterBodyPlan('crabby',{
  slots:{ head:1, back:4, legs:3, claws:2 },
}));
