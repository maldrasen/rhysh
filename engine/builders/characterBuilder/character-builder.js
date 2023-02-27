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

    [...(archetype.arcanum||[]), ...(species.arcanum||[])].forEach(code => {
      character.addArcanum(new Arcanum(code));
    });

    [...(archetype.gnosis||[]), ...(species.gnosis||[])].forEach(code => {
      character.addGnosis(new Gnosis(code));
    });

    [...(archetype.powers||[]), ...(species.powers||[])].forEach(code => {
      character.addPower(new Power(code));
    });
  }

  function addSkills(character) {
    SkillDictionary.allCodes().forEach(code => {
      let skill = new Skill(code);
          skill.setLevel(character.getArchetype().startingSkills[code]||0);

      character.addSkill(skill);
    });
  }

  function addStartingEquipment(character) {
    ObjectHelper.each(character.getArchetype().startingEquipment, (slot, options) => {
      let equipment = EquipmentBuilder.build({ ...options, for:character });

      // Equipment may be null if the species cannot use the archetype's
      // default equipment.
      if (equipment) {
        Inventory.add(equipment);
        equipment.setEquippedBy(character,slot);
      }
    });
  }

  return {
    buildMainCharacter
  }

})();
