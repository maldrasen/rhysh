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
    { name:'Armet',      types:[_plate]},
    { name:'Barbute',    types:[_plate]},
    { name:'Bascinet',   types:[_plate]},
    { name:'Burgonet',   types:[_plate]},
    { name:'Coif',       types:[_chain,_scale]},
    { name:'Cowl',       types:[_cloth,_leather,_hide]},
    { name:'Great Helm', types:[_plate]},
    { name:'Heaume',     types:[_plate]},
    { name:'Helm',       types:[_plate]},
    { name:'Hood',       types:[_cloth,_leather,_hide]},
    { name:'Sallet',     types:[_plate]},
    { name:'Tricorn',    types:[_leather]},
  ];

  const ChestPieces = [
    { name:'Armor',       types:[_chain,_scale,_plate]},
    { name:'Breastplate', types:[_plate]},
    { name:'Brigandine',  types:[_leather,_hide]},
    { name:'Bustier',     types:[_cloth],                tags:['notMale',_lewd]},
    { name:'Cassock',     types:[_cloth]},
    { name:'Coat',        types:[_cloth,_leather]},
    { name:'Corset',      types:[_leather,_hide],        tags:['notMale',_lewd]},
    { name:'Cuirass',     types:[_plate]},
    { name:'Doublet',     types:[_cloth,_leather]},
    { name:'Gambeson',    types:[_cloth]},
    { name:'Gown',        types:[_cloth],                tags:['notMale']},
    { name:'Habergeon',   types:[_chain,_scale]},
    { name:'Harness',     types:[_leather,_hide],        tags:[_lewd]},
    { name:'Hauberk',     types:[_chain,_scale]},
    { name:'Jacket',      types:[_cloth,_leather]},
    { name:'Jerkin',      types:[_cloth,_leather]},
    { name:'Overcoat',    types:[_cloth,_leather]},
    { name:'Robes',       types:[_cloth]},
    { name:'Shirt',       types:[_chain]},
    { name:'Tunic',       types:[_cloth]},
    { name:'Vest',        types:[_cloth,_leather]},
    { name:'Vestment',    types:[_cloth]},
  ];

  const LegPieces = [
    { name:'Britches',   types:[_cloth,_leather,_hide]},
    { name:'Chaps',      types:[_leather,_hide],                       tags:[_lewd,_roomy]},
    { name:'Chausses',   types:[_cloth,_leather,_hide,_chain],         tags:[_lewd,_roomy]},
    { name:'Cockplate',  types:[_plate],                               tags:[_lewd,_roomy,_notFemale]},
    { name:'Codpiece',   types:[_plate],                               tags:[_lewd,_roomy,_notFemale]},
    { name:'Culottes',   types:[_cloth,_leather,_hide]},
    { name:'Faulds',     types:[_scale,_plate]},
    { name:'Greaves',    types:[_scale,_plate]},
    { name:'Hosen',      types:[_leather,_hide,_chain,_scale]},
    { name:'Kilt',       types:[_cloth,_leather,_hide,_chain],         tags:[_roomy]},
    { name:'Legging',    types:[_cloth,_leather,_hide]},
    { name:'Legplates',  types:[_plate],                               tags:[_lewd,_roomy]},
    { name:'Loincloth',  types:[_cloth,_leather,_hide,_chain,_scale],  tags:[_lewd,_roomy]},
    { name:'Pantaloons', types:[_cloth]},
    { name:'Pants',      types:[_cloth,_leather,_hide,_chain]},
    { name:'Sarong',     types:[_cloth],                               tags:[_notMale,_roomy]},
    { name:'Sash',       types:[_cloth],                               tags:[_lewd,_roomy]},
    { name:'Skirt',      types:[_cloth,_leather],                      tags:[_notMale,_roomy]},
    { name:'Trousers',   types:[_cloth,_leather,_hide,_chain]},
  ];

  const HandPieces = [
    { name:'Bracers',    types:[_scale,_plate]},
    { name:'Gauntlets',  types:[_plate]},
    { name:'Gloves',     types:[_cloth,_leather,_hide,_chain]},
    { name:'Vambrances', types:[_leather,_hide,_chain,_scale,_plate]},
  ];

  const FootPieces = [
    { name:'Boots',      types:[_leather,_hide,_chain,_scale]},
    { name:'Buskins',    types:[_leather,_hide]},
    { name:'Greatboots', types:[_leather,_hide,_chain,_scale,_plate]},
    { name:'Sabatons',   types:[_plate]},
    { name:'Slippers',   types:[_cloth]},
    { name:'Sollerets',  types:[_plate]},
  ];

  // Just building normal rarity stuff for now. The rare armors will have more
  // interesting options and include magical affixes. Armor names will probably
  // work like character names where each word in the name effects the armor
  // somehow, but not for normal rarity armors.
  function build(options) {
    options.armorType = armorTypeFrom(options);
    options.materialName = Random.from(MaterialNames[options.armorType]);

    // If we're building armor for a character, and that charactor cannot wear
    // armor in the specified slot (or at all) the armor builder simply returns
    // null.
    if (options.for) {
      let species = options.for.getSpeciesCode();
      if (species == _nymph) { return null; }
      if (species == _dragonkind) { return null; }
      if (species == _satyr && options.slot == _legs) { return null; }
    }

    let pieceList = {
      head:  HeadPieces,
      chest: ChestPieces,
      legs:  LegPieces,
      hands: HandPieces,
      feet:  FootPieces,
    }[options.slot];

    let piece = pieceForType(pieceList, options);
    if (piece == null) {
      console.error('=== Error ===')
      console.error('Cannot Build Armor With Options:',options);
      console.error('Selected Material:',material);
      return null;
    }

    let armor = new Armor(options.slot, options.armorType);
    armor.setName(`${options.materialName} ${piece.name}`);
    armor.setTags(piece.tags||[]);

    return armor;
  }

  // Choose a specific armor type. If the armorType option is set we use it
  // first. The options can be an array or a string. If it's an array we pick a
  // string at random to use.
  //
  // TODO: When generating more randomized loot we can use the rarity to pick a
  //       random material of that rarity.
  function armorTypeFrom(options) {
    if (options.armorType) {
      return (typeof options.armorType == 'object') ? Random.from(options.armorType) : options.armorType;
    }
    throw `TODO: Get armor type from rarity.`
  }

  // === Select Armor Piece ====================================================
  // The first part of building even a standard piece of armor is determining
  // the material.

  function pieceForType(pieceList, options) {
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
    if (sex == _male) { refuteTags.push(_notMale); }
    if (sex == _female) { refuteTags.push(_notFemale); }

    // The Dominatrix can only wear lewd chest and leg armor.
    if (archetype == _dominatrix) {
      if (options.slot == _chest) { requireTags.push(_lewd); }
      if (options.slot == _legs)  { requireTags.push(_lewd); }
    }

    // Currently it's just the minotaur that needs _roomy pants, but
    // eventually we'll want to check to see if a character's cock has grown
    // too large to wear normal pants.
    if (species == _minotaur && options.slot == _legs) {
      requireTags.push(_roomy);
    }

    for (let i=0; i<pieceList.length; i++) {
      let piece = pieceList[i];
      if (requirePass(requireTags, piece) && refutePass(refuteTags, piece) && ArrayHelper.contains(piece.types, options.armorType)) {
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



