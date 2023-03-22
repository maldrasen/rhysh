
global.WeaponAttackStoryTeller = (function() {

  const BashActionStories = [
    { text: `{{A::Name}} swings {{A::his}} {{A::weapon.main-hand.name}} at {{T::name}}.` },
    { text: `{{A::Name}} swings at {{T::name}} with {{A::his}} {{A::weapon.main-hand.name}}.` },
  ];

  const ShootActionStories = [
    { text:`{{A::Name}} shoots {{A::his}} {{A::weapon.main-hand.name}} at {{T::name}}.` },
    { text:`{{A::Name}} shoots at {{T::name}} with {{A::his}} {{A::weapon.main-hand.name}}.` },
  ];

  const SlashActionStories = [
    { text:`{{A::Name}} swings {{A::his}} {{A::weapon.main-hand.name}} at {{T::name}}.` },
    { text:`{{A::Name}} slashes at {{T::name}} with {{A::his}} {{A::weapon.main-hand.name}}.` },
  ];

  const ThrustActionStories = [
    { text:`{{A::Name}} thrusts {{A::his}} {{A::weapon.main-hand.name}} at {{T::name}}.` },
    { text:`{{A::Name}} lunges at {{T::name}} with {{A::his}} {{A::weapon.main-hand.name}}.` },
    { text:`{{A::Name}} stabs at {{T::name}} with {{A::his}} {{A::weapon.main-hand.name}}.` },
  ];

  // Get an action story given a weapon mode and the context. The weapon object
  // is optional, and isn't currently used for anything. We may someday have
  // more interesting stories for special weapons at some point though which
  // will probably be saved on the weapon itself. A bit up in the air still,
  // but as we should have easy access to the weapon might as well include it.
  //
  // Options:
  //   mode: weapon mode
  //   weapon: weapon object
  //
  function tellActionStory(options) {
    const scrutinizer = new Scrutinizer(options.context);

    const storyList = {
      bash: BashActionStories,
      shoot: ShootActionStories,
      slash: SlashActionStories,
      thrust: ThrustActionStories,
    }[options.mode];

    const validStories = ArrayHelper.compact(storyList.map(story => {
      return scrutinizer.meetsRequirements(story.requires) ? story : null;
    }));

    return Weaver.weave(Random.from(validStories).text, options.context);
  }

  // TODO: Keeping the result stories for weapon attacks simple for now.
  //       Eventually I'd like to tell more involved stories for critical hits
  //       and misses. I need to implement the critical miss concequences first
  //       in order to know what happens. Critical hits will mostly be a lot of
  //       dick stabbing and such I think.
  function tellResultStory(options) {
    let text;

    if (options.attackEvent.isMiss()) { text = tellMissStory(options.attackEvent); }
    if (options.attackEvent.isHit()) { text = tellHitStory(options.attackEvent); }
    if (options.attackEvent.isCriticalMiss()) { text = tellCriticalMissStory(options.attackEvent); }
    if (options.attackEvent.isCriticalHit()) { text = tellCriticalHitStory(options.attackEvent); }

    return Weaver.weave(text, options.context);
  }

  // `{{T::Name's}} {{battle|target-slot-word}} was delt a critical blow!`:
  // `Hit {{T::name's}} {{battle|target-slot-word}}.`

  function tellMissStory(event) {
    return '(TODO:Miss)';
  }

  function tellHitStory(event) {
    return '(TODO:Hit)';
  }

  function tellCriticalMissStory(event) {
    return '(TODO:Critical Miss)';
  }

  function tellCriticalHitStory(event) {
    return '(TODO:Critical Hit)';
  }

  return { tellActionStory, tellResultStory }

})();
