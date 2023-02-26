EquipmentBuilder.ArmorBuilder = (function() {

  const MaterialNames = {
    cloth:   ['Brocade','Embroidered','Quilted','Silk','Silken','Velvet','Woolen','Woven'],
    leather: ['Black Leather','Buckskin','Cuir','Deerskin','Feathered','Snakeskin','Tanned'],
    hide:    ['Bearskin','Fur','Hide','Rawhide','Studded Leather','Wolfhide'],
    chain:   ['Blackened Chainmail','Boneweave','Bronze Chain','Chainmail','Ringmail','Splintmail'],
    scale:   ['Copper Scale','Ironscale','Laminar','Scaled','Scalemail','Steel Scale'],
    plate:   ['Blackened Steel','Engraved Steel','Platemail','Polished Steel','Steel'],
  };

  const HeadPieces = [
    { name:'Armet',      materials:['plate']},
    { name:'Barbute',    materials:['plate']},
    { name:'Bascinet',   materials:['plate']},
    { name:'Burgonet',   materials:['plate']},
    { name:'Coif',       materials:['chain','scale']},
    { name:'Cowl',       materials:['cloth','leather','hide']},
    { name:'Great Helm', materials:['plate']},
    { name:'Heaume',     materials:['plate']},
    { name:'Helm',       materials:['plate']},
    { name:'Hood',       materials:['cloth','leather','hide']},
    { name:'Sallet',     materials:['plate']},
    { name:'Tricorn',    materials:['leather']},
  ];

  const ChestPieces = [
    { name:'Armor',       materials:['chain','scale','plate']},
    { name:'Breastplate', materials:['plate']},
    { name:'Brigandine',  materials:['leather','hide']},
    { name:'Bustier',     materials:['cloth'],                                  tags:['not-male','lewd']},
    { name:'Cassock',     materials:['cloth']},
    { name:'Coat',        materials:['cloth','leather']},
    { name:'Corset',      materials:['leather','hide'],                         tags:['not-male','lewd']},
    { name:'Cuirass',     materials:['plate']},
    { name:'Doublet',     materials:['cloth','leather']},
    { name:'Gambeson',    materials:['cloth']},
    { name:'Gown',        materials:['cloth'],                                  tags:['not-male']},
    { name:'Habergeon',   materials:['chain','scale']},
    { name:'Harness',     materials:['leather','hide'],                         tags:['lewd']},
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

  const LegPieces = [
    { name:'Britches',   materials:['cloth','leather','hide']},
    { name:'Chaps',      materials:['leather','hide'],                          tags:['lewd','roomy']},
    { name:'Chausses',   materials:['cloth','leather','hide','chain'],          tags:['lewd','roomy']},
    { name:'Cockplate',  materials:['plate'],                                   tags:['lewd','roomy','not-female']},
    { name:'Codpiece',   materials:['plate'],                                   tags:['lewd','roomy','not-female']},
    { name:'Culottes',   materials:['cloth','leather','hide']},
    { name:'Faulds',     materials:['scale','plate']},
    { name:'Greaves',    materials:['scale','plate']},
    { name:'Hosen',      materials:['leather','hide','chain','scale']},
    { name:'Kilt',       materials:['cloth','leather','hide','chain'],          tags:['roomy']},
    { name:'Legging',    materials:['cloth','leather','hide']},
    { name:'Legplates',  materials:['plate'],                                   tags:['lewd','roomy']},
    { name:'Loincloth',  materials:['cloth','leather','hide','chain','scale'],  tags:['lewd','roomy']},
    { name:'Pantaloons', materials:['cloth']},
    { name:'Pants',      materials:['cloth','leather','hide','chain']},
    { name:'Sarong',     materials:['cloth'],                                   tags:['not-male','roomy']},
    { name:'Sash',       materials:['cloth'],                                   tags:['lewd','roomy']},
    { name:'Skirt',      materials:['cloth','leather'],                         tags:['not-male','roomy']},
    { name:'Trousers',   materials:['cloth','leather','hide','chain']},
  ];

  const HandPieces = [
    { name:'Bracers',    materials:['scale','plate']},
    { name:'Gauntlets',  materials:['plate']},
    { name:'Gloves',     materials:['cloth','leather','hide','chain']},
    { name:'Vambrances', materials:['leather','hide','chain','scale','plate']},
  ];

  const FootPieces = [
    { name:'Boots', materials:['leather','hide','chain','scale']},
    { name:'Buskins', materials:['leather','hide']},
    { name:'Greatboots', materials:['leather','hide','chain','scale','plate']},
    { name:'Sabatons', materials:['plate']},
    { name:'Slippers', materials:['cloth']},
    { name:'Sollerets', materials:['plate']},
  ];

  // Just building normal rarity stuff for now. The rare armors will have more
  // interesting options and include magical affixes. Armor names will probably
  // work like character names where each word in the name effects the armor
  // somehow, but not for normal rarity armors.
  function build(options) {
    options.material = materialValue(options.material);
    options.materialName = Random.from(MaterialNames[options.material]);


    // If we're building armor for a character, and that charactor cannot wear
    // armor in the specified slot (or at all) the armor builder simply returns
    // null.
    if (options.for) {
      let species = options.for.getSpeciesCode();
      if (species == 'nymph') { return null; }
      if (species == 'dragonkind') { return null; }
      if (species == 'satyr' && options.type == 'legs') { return null; }
    }

    let pieceList = {
      head:  HeadPieces,
      chest: ChestPieces,
      legs:  LegPieces,
      hands: HandPieces,
      feet:  FootPieces,
    }[options.type];

    let piece = pieceForMaterial(pieceList, options);

    if (piece == null) {
      console.error('=== Error ===')
      console.error('Cannot Build Armor With Options:',options);
      console.error('Selected Material:',material);
      return null;
    }

    let armor = new Armor(options.type, options.material);
    armor.setName(`${options.materialName} ${piece.name}`);
    armor.setTags(piece.tags||[]);

    return armor;
  }

  // Choose a specific armor material. If a material is specified we can use
  // it to narrow down our choices, otherwise we can use the rarity to pick a
  // random material of that rarity. The material parameter can be an array or
  // a string. If it's an array we pick a string at random to use.
  function materialValue(material) {
    return (typeof material == 'object') ? Random.from(material) : material;
  }

  // === Select Armor Piece ====================================================
  // The first part of building even a standard piece of armor is determining
  // the material.

  function pieceForMaterial(pieceList, options) {
    let available = [];
    let requireTags = [];
    let refuteTags = [];

    let archetype;
    let species;
    let sex;

    if (options.for) {
      archetype = options.for.getArchetypeCode();
      species = options.for.getSpeciesCode();
      sex = options.for.getSex();
    }

    // Some armor cannot be worn by men or women.
    if (sex == 'male') { refuteTags.push('not-male'); }
    if (sex == 'female') { refuteTags.push('not-female'); }

    // The Dominatrix can only wear lewd chest and leg armor.
    if (archetype == 'dominatrix') {
      if (options.type == 'chest') { requireTags.push('lewd'); }
      if (options.type == 'legs')  { requireTags.push('lewd'); }
    }

    // Currently it's just the minotaur that needs 'roomy' pants, but
    // eventually we'll want to check to see if a character's cock has grown
    // too large to wear normal pants.
    if (species == 'minotaur' && options.type == 'legs') {
      requireTags.push('roomy');
    }

    for (let i=0; i<pieceList.length; i++) {
      let piece = pieceList[i];
      if (requirePass(requireTags, piece) && refutePass(refuteTags, piece) && ArrayHelper.contains(piece.materials, options.material)) {
        available.push(piece);
      }
    }

    return Random.from(available);
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

// TODO: Non Basic Head Armor
//   Cap (Faerie)
//   Hat (Feathered)
//   Crown
//   Diadem
//   Coxcomb
//   Horns
//   Veil (female)
//   Tiara (female)
//   Masks (Goat Mask, Horse's Head, etc.)
//   Blindfold
//   "Eye of"
//   "Gaze"
//   Bit Gag
//   Ball Gag
//   Ring Gag
//   Muzzle

// TODO: Non basic chest armor
//   "Draped Finery"
//   Restraints
//   Breast Bindings
//   Ropes
//   Carapace
//   Gownless Evening Strap
//   Raiment

// TODO: Non Basic Legs Armor
//   Knickers (female)
//   Merkin
//   Panties (female)
//   Cratchless Panties (female)
//   Cock Cage (male)
//   Bitches Britches (female)

// TODO: Non Basic Hand Armor
//   Fists
//   Stranglers, Crushers, Grips, Fisters
//   Manacles, Shackles, Cuffs
//   Claws, Paws
//   Spellfingers
//   Touch of, Grasp of

// TODO: Non Basic Foot Armor
//   Glass Slippers
//   Pumps, Stilettos (female)
//   Hooves
//   Stompers, Kickers, Punters, Striders, etc



