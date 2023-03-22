global.OLDCombatResult = class CombatResult {
/*
  selectStory() {
    new Scrutinizer(new Context({
      combatResult: this,
      combatRound: this.#combatRound,
      actor: this.getActor(),
      target: this.getTarget(),
    }));

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

*/
}
