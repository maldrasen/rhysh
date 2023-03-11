global.Target = class Target {
  
  #type;
  #rank;
  #actor;

  constructor(type) {
    Validate.isIn(type, TargetTypes);
    this.#type = type;
  }

  getType() { return this.#type; }
  getRank() { return this.#rank; }
  getActor() { return this.#actor; }

  setRank(rank) {
    if (rank != null) { Validate.isIn(rank, ['rank-1', 'rank-2', 'rank-3', 'rank-4', 'rank-5']); }
    this.#rank = rank;
  }

  setActor(actor) {
    this.#actor = actor;
  }

  isSingleTarget() { return ['monster','character'].indexOf(this.#type) >= 0; }
  targetsCharacters() { return ['party','character','everyone'].indexOf(this.#type) >= 0; }
  targetsMonsters() { return ['monster','rank','all-monsters','everyone'].indexOf(this.#type) >= 0; }

}
