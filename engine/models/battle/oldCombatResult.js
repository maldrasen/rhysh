global.OLDCombatResult = class CombatResult {
/*

  constructor(round) {
    this.#combatRound = round
    this.#attackDamage = 0;
    this.#conditionChanges = [];
    this.#statusChanges = [];

    this.#scrutinizer = new Scrutinizer(new Context({
      combatResult: this,
      combatRound: this.#combatRound,
      actor: this.getActor(),
      target: this.getTarget(),
    }));
  }

  getAbility() { return this.#combatRound.getAbility(); }

  isConditionChanged() { return this.#conditionChanges.length > 0; }
  getConditionChanges() { return this.#conditionChanges; }
  addConditionChange(change) { this.#conditionChanges.push(change); }

  isStatusChanged() { return this.#statusChanges.length > 0; }
  getStatusChanges() { return this.#statusChanges; }
  addStatusChange(change) { this.#statusChanges.push(change); }

  updateCondition() {
    let ability = this.getAbility();

    if (ability.setCondition && this.isValidWhen(ability.setCondition.when)) {
      this.addConditionChange({ on:ability.setCondition.on, set:ability.setCondition.condition });

      if (ability.setCondition.on == _self) {
        this.getActor().getCondition().setCondition(ability.setCondition.condition);
      }
      if (ability.setCondition.on == _single) {
        this.getTarget().getCondition().setCondition(ability.setCondition.condition);
      }
    }
  }

  updateStatus() {
    let ability = this.getAbility();

    if (ability.addStatus && this.isValidWhen(ability.addStatus.when)) {
      this.addStatusChange({ on:ability.addStatus.on, add:ability.addStatus.status });

      if (ability.addStatus.on == _self) {
        return this.getActor().getCondition().setStatus(ability.addStatus.status, ability.addStatus.duration);
      }
      if (ability.addStatus.on == _single) {
        return this.getTarget().getCondition().setStatus(ability.addStatus.status, ability.addStatus.duration);
      }
      throw `TODO: Handle ability.addStatus.on=${ability.addStatus.on}`
    }
  }

  isValidWhen(when) {
    if (when == _always)  { return true; }
    if (when == _success) { return this.isSuccess(); }
    if (then == _failure) { return this.isFailure(); }
  }

  selectStory() {
    let ability = this.getAbility();

    if (ability.storyTeller) {
      throw `TODO: Implement Story Tellers.`;
    }

    let validStories = [];

    ability.stories.forEach(story => {
      if (this.#scrutinizer.meetsRequirements(story.when)) {
        if ((story.chance) ? (Random.roll(100) < story.chance) : true) {
          validStories.push(story);
        }
      }
    });

    if (validStories.length == 0) {
      console.error('There are no valid stories for a MonsterCombatRound with the following state:')
      console.error(this.pack());
      throw `No valid stories`;
    }

    this.#story = Random.from(validStories);
    this.#attackDamage += (this.#story.bonusDamage || 0);
  }

  commitDamage() {
    if (this.#attackDamage > 0) {
      this.getTarget().doDamage(this.#attackDamage);
    }
  }

*/
}
