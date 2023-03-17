

global.MonsterBuilder = (function() {
  const $dictionary = {}

  let $battleState;

  function register(code, builder) {
    $dictionary[code] = builder;
  }

  function build(code, options={}) {
    if ($dictionary[code] == null) { throw `Unknown Monster(${code})` }
    return $dictionary[code](options);
  }

  // TODO: Eventually this will need to read data from the current zone and
  //       possibly from the region within the zone. This should give us a list
  //       of possible encounter formations that we then use to generate the
  //       monsters. That might be a bit far out still, for now we can just
  //       generate goblins or mudcrabs.
  function populateBattleState(battle, options={}) {
    if (options.monster == 'mudcrab') { return tempMudcrabs(battle); }
    if (options.monster == 'goblin') { return tempGoblins(battle); }

    (Random.roll(6) < 4) ? tempMudcrabs(battle) : tempGoblins(battle);
  }

  function tempMudcrabs(battle) {
    forUpTo((Random.roll(4)+1), i => {
      let crabs = [];
      let count = Random.roll(2) + 4;

      forUpTo(count, i => {
        crabs.push(build('mudcrab'));
      });

      battle.addSquad(i+1,crabs,"Mudcrabs");
    });
  }

  function tempGoblins(battle) {
    forUpTo((Random.roll(4)+1), i => {
      let gobbos = [];
      let count = Random.roll(2) + 3;

      for (let i=0; i<count; i++) {
        gobbos.push(build('goblin'));
      }

      battle.addSquad(i+1,gobbos,"Goblins");
    });
  }

  return { register, build, populateBattleState }

})();
