global.MonsterBody = class MonsterBody {

  #sex;
  #sizeClass;
  #slots;

  #cock;
  #pussy;
  #tits;

  // The monster body is a slimmed down version of the bodies that the
  // characters will have. They don't need to be persisted, but they also
  // may have more variery, different body parts and so forth.
  constructor(options) {
    let bodyPlan = options.bodyPlan || MonsterBodyPlans.Humanoid;

    this.#sex = options.sex || _male;
    this.#slots = bodyPlan.slots;
    this.#sizeClass = options.sizeClass || _medium;

    this.#cock = bodyPlan.buildCock(this);
    this.#pussy = bodyPlan.buildPussy(this);
    this.#tits = bodyPlan.buildTits(this);

    Validate.isIn(this.#sex, Sexes);
    Validate.isIn(this.#sizeClass, Object.keys(SizeClasses));
  }

  getSlots() { return this.#slots; }
  setSlots(slots) {  }

  getSex() { return this.#sex; }
  getSizeClass() { return this.#sizeClass; }

  getCock()  { return this.#cock; }
  getPussy() { return this.#pussy; }
  getTits()  { return this.#tits; }

  hasCock()  { return this.#cock != null; }
  hasPussy() { return this.#pussy != null; }
  hasTits()  { return this.#tits != null; }

  // TODO: Body part describers for monsters.
  briefDescriptionOfBalls() { return this.hasCock() ? `TODO[Monster's Balls]` : `ERROR[No Balls]` }
  briefDescriptionOfCock() { return this.hasCock() ? `TODO[Monster's Cock]` : `ERROR[No Cock]` }
  briefDescriptionOfPussy() { return this.hasPussy() ? `TODO[Monster's Pussy]` : `ERROR[No Pussy]` }
  briefDescriptionOfTits() { return this.hasTits() ? `TODO[Monster's Tits]` : `ERROR[No Tits]` }
}
