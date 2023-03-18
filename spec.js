
global.expect = require('chai').expect;
global.ROOT = require('path').normalize(`${__dirname}`).replace(/\\/g,"/");
global.DATA = `${ROOT}/test`

require(`${ROOT}/engine/boot.js`);

before(function() {
  FeatureSet.init();
});

global.SpecHelper = {

  print(message) {
    if (Environment.verbose) { console.log(`      ${message}`); }
  },

  tenTimes(done, testFunction) {
    let times = Environment.verbose ? 10 : 1
    let tests = [];

    for (let i=0; i<times; i++) {
      tests.push(new Promise(resolve => {
        testFunction(resolve);
      }));
    };

    Promise.all(tests).then(()=>{ done(); });
  },

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  },

  randomMainCharacter(options = {}) {
    let archetypeList = ['chosen','cultist','dominatrix','knight','mindbender','slaver'];
    let sexList = ['male','female','futa'];

    if (options.archetype == null) {
      if (options.species != null) { throw `An appropriate archetype must be selected when given a species.` }
      if (options.sex != null) { throw `An appropriate archetype must be selected when given a sex.` }
    }

    let archetypeCode = (options.archetype) ? options.archetype : Random.from(archetypeList);
    let archetype = Archetype.lookup(archetypeCode);
    let speciesCode = (options.species) ? options.species : Random.from(archetype.availableSpecies);
    let species = Species.lookup(speciesCode);
    let sex = (options.sex) ? options.sex : Random.from(archetype.availableSexes);

    // Make sure the sex works for the species too, not just the archetype.
    if (speciesCode == 'nymph' && sex == 'male') { sex = 'futa'; }
    if (speciesCode == 'minotaur' && sex != 'male') { sex = 'male'; }

    let name = NameBuilder.getFullRandom(sex,'elf')

    return CharacterBuilder.buildMainCharacter({
      archetype: archetypeCode,
      species: speciesCode,
      sex: sex,
      firstName: name.first.name,
      lastName: name.last.name,
      attributes: species.baseAttributes,
    });
  },

};
