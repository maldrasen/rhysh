global.CharacterBuilder = (function() {

  function buildMainCharacter(options) {
    let mainCharacter = new Character("Main");

    mainCharacter.setArchetypeCode(options.archetype);
    mainCharacter.setSpeciesCode(options.species);
    mainCharacter.setSex(options.sex);
    mainCharacter.setFirstName(options.firstName);
    mainCharacter.setLastName(options.lastName);
    mainCharacter.setAttributes(new Attributes(options.attributes));
    mainCharacter.setCondition(new Condition());
    mainCharacter.save();

    setCondition(mainCharacter);
    addAbilities(mainCharacter);
    addSkills(mainCharacter);
    addStartingEquipment(mainCharacter);

    return mainCharacter;
  }

  function setCondition(character) {
    let condition = new Condition();

    condition.setMaxHitPoints(
      character.getSpecies().baseHitPoints +
      Random.roll(character.getArchetype().hitDice) + 1 +
      character.getAttributes().conModifier());

    character.setCondition(condition)
  }

  function addAbilities(character) {
    let archetype = character.getArchetype();
    let species = character.getSpecies();

    [...(archetype.arcanumList), ...(species.arcanumList)].forEach(code => {
      character.addArcanum(new ArcanumLevel(code));
    });

    [...(archetype.gnosisList), ...(species.gnosisList)].forEach(code => {
      character.addGnosis(new GnosisLevel(code));
    });

    [...(archetype.powerList), ...(species.powerList)].forEach(code => {
      character.addPower(new PowerLevel(code));
    });
  }

  function addSkills(character) {
    Object.keys(Skills).forEach(code => {
      let skill = new SkillLevel(code);
          skill.setLevel(character.getArchetype().startingSkills[code]||0);

      character.addSkill(skill);
    });
  }

  function addStartingEquipment(character) {
    ObjectHelper.each(character.getArchetype().startingEquipment, (slot, options) => {
      let equipment = EquipmentBuilder.build({ ...options, for:character });

      // Equipment may be null if the species cannot use the archetype's
      // default equipment. Twin weapons are probably only used in character
      // creation like this because I wanted the chosen to start with two one
      // handed weapons of the same type.
      if (equipment) {
        if (slot == 'twin') { return addTwinWeapons(character, equipment); }

        Inventory.add(equipment);
        equipment.setEquippedBy(character,slot);
      }
    });
  }

  function addTwinWeapons(character, mainHand) {
    let offHand = new Weapon(mainHand.getWeaponTypeCode());
    Inventory.add(mainHand);
    Inventory.add(offHand);
    mainHand.setEquippedBy(character,'mainHand');
    offHand.setEquippedBy(character,'offHand');
  }

  return {
    buildMainCharacter
  }

})();
