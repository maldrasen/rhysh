global.NameBuilder = (function() {

  const NameRestrictions = ['male','female','not-male','not-female','has-cock','has-pussy','has-tits','has-scales'];

  const Names = {
    DemonMale: [],
    DemonFemale: [],
    DemonLast: [],
    ElfMale: [],
    ElfFemale: [],
    ElfLast: [],
    GoblinMale: [],
    GoblinFemale: [],
    GoblinLast: [],
    Kobold: [],
  }

  function addName(data, index) {
    try {
      if (data.restriction) { Validate.isIn(data.restriction, NameRestrictions); }
    } catch(error) {
      console.error(`Invalid Name:`,data);
      throw error;
    }

    if (Names[index] == null) {
      throw `Unknown index: ${index}`;
    }

    Names[index].push(data);
  }

  // Options must at least have an index
  //
  //   { index:INDEX }
  //
  function getRandom(options) {
    let name;
    let tries = 0;

    if (Names[options.index] == null) {
      throw `Unknown index: ${options.index}`;
    }

    while (tries < 100) {
      tries += 1;
      name = Random.from(Names[options.index]);
      if (meetsRequirements(name, options)) {
        return name;
      }
    }

    // I give up, their name is Greg.
    return { name:"Greg" };
  }

  // Get a full random name given a gender and a species. Arguments should be
  // capitalized so that we can easilly make an index name from them.
  function getFullRandom(gender, species) {
    gender = TextHelper.titlecase(gender);
    species = TextHelper.titlecase(species);

    let sex = (gender == "Futa") ? "Female" : gender;

    if (species == 'Kobold') {
      return { first: getRandom({ index:'Kobold', sex:sex }) }
    }

    return {
      first: getRandom({ index:`${species}${sex}`, sex:sex }),
      last:  getRandom({ index:`${species}Last`,   sex:sex }),
    };
  }


  // This will eventually need to be rewritten. It works for checking against a
  // sex option, but eventually we'll probably need to check against a
  // character to see if the name fits or not.
  function meetsRequirements(name, options) {
    if (name.restriction) {
      if (name.restriction == 'male') { return options.sex == 'male'; }
      if (name.restriction == 'female') { return options.sex == 'female'; }
      if (name.restriction == 'not-male') { return options.sex != 'male';}
      if (name.restriction == 'not-female') { return options.sex != 'female'; }
      if (name.restriction == 'has-cock') { return options.sex != 'female'; }
      if (name.restriction == 'has-pussy') { return options.sex != 'male'; }
      if (name.restriction == 'has-tits') { return options.sex != 'male'; }
      if (name.restriction == 'has-scales') { return false; }
    }

    return true;
  }

  return { addName, getRandom, getFullRandom };

})();
