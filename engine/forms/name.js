global.Name = (function() {

  const NameRestrictions = ['male','female','not-male','not-female','has-cock','has-pussy','has-tits','has-scales'];
  const NamePositions = ['pre','first','last'];

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

  function add(data, index) {
    try {
      if (data.restriction) { Validate.isIn(data.restriction, NameRestrictions); }
      if (data.position) { Validate.isIn(data.position, NamePositions); }
    } catch(error) {
      console.error(`Invalid Name:`,data,options);
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

  // This will eventually need to be rewritten. It works for checking against a
  // sex option, but eventually we'll probably need to check against a
  // character to see if the name fits or not.
  function meetsRequirements(name, options) {
    if (options.position && (name.position != options.position)) { console.log("No, bad position"); return false; }
    if (options.species && (name.species != options.species)) { console.log("No, bad species"); return false; }

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

  return { add, getRandom };

})();