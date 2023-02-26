EquipmentBuilder.ChestArmorBuilder = (function() {

  // TODO: Non basic chest armor
  //   "Draped Finery"
  //   Restraints
  //   Breast Bindings
  //   Ropes
  //   Carapace
  //   Gownless Evening Strap
  //   Raiment

  const Pieces = [
    { name:'Armor',       materials:['chain','scale','plate']},
    { name:'Breastplate', materials:['plate']},
    { name:'Brigandine',  materials:['leather','hide']},
    { name:'Bustier',     materials:['cloth'], tags:['female','lewd']},
    { name:'Cassock',     materials:['cloth']},
    { name:'Coat',        materials:['cloth','leather']},
    { name:'Corset',      materials:['leather'], tags:['female','lewd']},
    { name:'Cuirass',     materials:['plate']},
    { name:'Doublet',     materials:['cloth','leather']},
    { name:'Gambeson',    materials:['cloth']},
    { name:'Gown',        materials:['cloth'], tags:['female']},
    { name:'Habergeon',   materials:['chain','scale']},
    { name:'Harness',     materials:['leather'], tags:['lewd']},
    { name:'Hauberk',     materials:['chain','scale']},
    { name:'Jacket',      materials:['cloth','leather']},
    { name:'Jerkin',      materials:['cloth','leather']},
    { name:'Overcoat',    materials:['cloth','leather']},
    { name:'Robes',       materials:['cloth']},
    { name:'Shirt',       materials:['chain']},
    { name:'Tunic',       materials:['cloth']},
    { name:'Vest',        materials:['cloth','leather']},
    { name:'Vestment',    materials:['cloth']},
  ];

  function build(options) {
    return {
      slot: 'chest',
      material: options.material,
      name: `${options.materialName} ${pieceForMaterial(options)}`
    }
  }

  function pieceForMaterial(options) {
    let available = [];
    let requireTags = [];
    let refuteTags = [];

    if (options.sex == 'male') { refuteTags.push('female'); }
    if (options.archetype == 'dominatrix') { requireTags.push('lewd'); }

    for (let i=0; i<Pieces.length; i++) {
      let piece = Pieces[i];
      if (requirePass(requireTags, piece) && refutePass(refuteTags, piece) && ArrayHelper.contains(piece.materials, options.material)) {
        available.push(piece);
      }
    }

    return Random.from(available).name;
  }

  function requirePass(tags,piece) {
    if (tags.length == 0) { return true; }
    if (piece.tags == null) { return false; }

    for (let i=0; i<tags.length; i++) {
      if (piece.tags.indexOf(tags[i]) < 0) { return false; }
    }

    return true;
  }

  function refutePass(tags,piece) {
    if (tags.length == 0) { return true; }
    if (piece.tags == null) { return true; }

    for (let i=0; i<tags.length; i++) {
      if (piece.tags.indexOf(tags[i]) >= 0) { return false; }
    }

    return true;
  }

  return { build };

})();
