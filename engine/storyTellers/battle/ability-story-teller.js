global.AbilityStoryTeller = (function() {

  function pickStory(options, storyType) {
    let scrutinizer = new Scrutinizer(options.context);
    let ability = options.ability;
    let validStories = [];

    if (ability.storyTeller) {
      throw `TODO: Implement Story Tellers.`;
    }

    ability[storyType].forEach(story => {
      if (scrutinizer.meetsRequirements(story.requires)) { validStories.push(story); }
    });

    if (validStories.length == 0) {
      if (storyType == 'successStories') { return { text:`` }; }
      if (storyType == 'failureStories') { return { text:`Miss` }; }
    }

    if (validStories.length == 0) {
      console.error(`There are no valid stories. Ability(${ability.code}) Type(${ability.type})`)
      console.trace();
      throw `No valid stories`;
    }

    return Random.from(validStories);
  }

  function tellActionStory(options) {
    let story = pickStory(options,'actionStories');
    return Weaver.weave(story.text, options.context);
  }

  function tellResultStory(options) {
    let story = pickStory(options, options.attackEvent.isSuccess() ? 'successStories' : 'failureStories');
    return Weaver.weave(story.text, options.context);
  }

  return {
    tellActionStory,
    tellResultStory,
  };

})();
