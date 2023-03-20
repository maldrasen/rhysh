global.CharacterPacker = (function() {

  function pack(character) {
    let data = {
      code: character.getCode(),
      level: character.getLevel(),
      experience: character.getExperience(),
      attributes: character.getAttributes().pack(),
      condition: character.getCondition().pack(),

      firstName: character.getFirstName(),
      lastName: character.getLastName(),
      sex: character.getSex(),

      archetypeCode: character.getArchetypeCode(),
      speciesCode: character.getSpeciesCode(),

      arcanumMap: {},
      gnosisMap: {},
      powerMap: {},
      skillMap: {},
    }

    ObjectHelper.each(character.getArcanumMap(), (code, arcanum) => {
      data.arcanumMap[code] = arcanum.pack();
    });

    ObjectHelper.each(character.getGnosisMap(), (code, gnosis) => {
      data.gnosisMap[code] = gnosis.pack();
    });

    ObjectHelper.each(character.getPowerMap(), (code, power) => {
      data.powerMap[code] = power.pack();
    });

    ObjectHelper.each(character.getSkillMap(), (code, skill) => {
      data.skillMap[code] = skill.pack();
    });

    return data;
  }

  function packForStatus(character) {
    return {
      code: character.getCode(),
      portrait: character.getPortrait(),
      firstName: character.getFirstName(),
      condition: character.getCondition().pack(),
    };
  }

  // === Battle ================================================================

  function packForBattle(character) {
    let abilityList = character.getAbilities().map(code => {
      return packAbility(code);
    });

    let spellList = character.getSpells().map(code => {
      return packSpell(code);
    });

    let packed = {
      code: character.getCode(),
      condition: character.getCondition().pack(),
      fullName: character.getFullName(),
      abilityList: abilityList,
      spellList: spellList,
    };

    if (character.getCode() == 'Main') {
      packed.orders = packOrders();
    }

    let equipped = Inventory.getEquippedBy(character);
    let mainHand = equipped['mainHand'];
    let offHand = equipped['offHand'];

    if (mainHand) { packed.mainHand = mainHand.packForBattle(); }
    if (offHand) { packed.offHand = offHand.packForBattle(); }

    return packed;
  }

  function packAbility(code) {
    return { code:code }
  }

  function packSpell(code) {
    return { code:code }
  }

  function packOrders() {
    return [{ name:"Retreat", code:'retreat' }];
  }

  // ===========================================================================

  function unpack(data) {
    let character = new Character(data.code);
    character.setLevel(data.level);
    character.setExperience(data.experience);
    character.setAttributes(Attributes.unpack(data.attributes));
    character.setCondition(Condition.unpack(data.condition));

    character.setFirstName(data.firstName);
    character.setLastName(data.lastName);
    character.setSex(data.sex);

    character.setArchetypeCode(data.archetypeCode);
    character.setSpeciesCode(data.speciesCode);

    ObjectHelper.each(data.arcanumMap, (code, arcanumData) => {
      character.addArcanum(ArcanumLevel.unpack(arcanumData));
    });

    ObjectHelper.each(data.gnosisMap, (code, gnosisData) => {
      character.addGnosis(GnosisLevel.unpack(gnosisData));
    });

    ObjectHelper.each(data.powerMap, (code, powerData) => {
      character.addPower(PowerLevel.unpack(powerData));
    });

    ObjectHelper.each(data.skillMap, (code, skillData) => {
      character.addSkill(SkillLevel.unpack(skillData));
    });

    return character;
  }

  return {
    pack,
    packForStatus,
    packForBattle,
    unpack,
  }


})();