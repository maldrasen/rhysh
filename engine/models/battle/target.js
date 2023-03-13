global.Target = class Target {
  
  #type;
  #rank;
  #identifier;

  constructor(type, identifier) {
    Validate.isIn(type, TargetTypes);
    this.#type = type;
    this.#identifier = identifier;
  }

  getType() { return this.#type; }
  getRank() { return this.#rank; }
  getIdentifier() { return this.#identifier; }

  getActor() {
    return (this.#type == _character) ?
      CharacterLibrary.getCachedCharacter(this.#identifier) :
      GameState.getCurrentBattle().getMonster(this.#identifier);
  }

  setRank(rank) {
    if (this.#identifier != null) { throw 'Target cannot have a rank if an identifier is set.'; }
    if (rank != null) { Validate.isIn(rank, ['rank-1', 'rank-2', 'rank-3', 'rank-4', 'rank-5']); }
    this.#rank = rank;
  }

  setIdentifier(identifier) {
    if (this.#rank != null) { throw 'Target cannot have an identifier if a rank is set.'; }
    this.#identifier = identifier;
  }

  isSingleTarget() { return [_monster,_character].indexOf(this.#type) >= 0; }
  targetsCharacters() { return [_party,_character,_everyone].indexOf(this.#type) >= 0; }
  targetsMonsters() { return [_monster,_rank,_allMonsters,_everyone].indexOf(this.#type) >= 0; }
}
