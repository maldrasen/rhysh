EquipmentBuilder.ArmorBuilder = (function() {

  const BuilderByType = {
    head:  'HeadArmorBuilder',
    chest: 'ChestArmorBuilder',
    legs:  'LegArmorBuilder',
    hands: 'HandArmorBuilder',
    feet:  'FootArmorBuilder',
  };

  const MaterialNames = {
    cloth:   ['Brocade','Embroidered','Quilted','Silk','Silken','Velvet','Woolen','Woven'],
    leather: ['Black Leather','Buckskin','Cuir','Deerskin','Feathered','Snakeskin','Tanned'],
    hide:    ['Bearskin','Fur','Hide','Rawhide','Studded Leather','Wolfhide'],
    chain:   ['Blackened Chainmail','Boneweave','Bronze Chain','Chainmail','Ringmail','Splintmail'],
    scale:   ['Copper Scale','Ironscale','Laminar','Scaled','Scalemail','Steel Scale'],
    plate:   ['Blackened Steel','Engraved Steel','Platemail','Polished Steel','Steel'],
  };

  // Just building normal rarity stuff for now. The rare armors will have more
  // interesting options and include magical affixes. Armor names will probably
  // work like character names where each word in the name effects the armor
  // somehow, but not for normal rarity armors.
  function build(options) {
    options.material = materialValue(options.material);
    options.materialName = Random.from(MaterialNames[options.material]);
    return EquipmentBuilder[BuilderByType[options.type]].build(options);
  }

  // Choose a specific armor material. If a material is specified we can use
  // it to narrow down our choices, otherwise we can use the rarity to pick a
  // random material of that rarity. The material parameter can be an array or
  // a string. If it's an array we pick a string at random to use.
  function materialValue(material) {
    return (typeof material == 'object') ? Random.from(material) : material;
  }

  return { build };

})();
