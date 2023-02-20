describe('NameBuilder', function() {

  it("gets a random demon female name", function() {
    forUpTo(10, () => {
      let first = NameBuilder.getRandom({ index:'DemonFemale', sex:'female' });
      let last = NameBuilder.getRandom({ index:'DemonLast', sex:'female' });
      log(`    Female Demon Name: ${first.name} ${last.name}`);
    });
  });

  it("gets a random demon male name", function() {
    forUpTo(10, () => {
      let first = NameBuilder.getRandom({ index:'DemonMale', sex:'male' });
      let last = NameBuilder.getRandom({ index:'DemonLast', sex:'male' });
      log(`    Male Demon Name: ${first.name} ${last.name}`);
    });
  });

  it("gets a random demon futa name", function() {
    forUpTo(10, () => {
      let first = NameBuilder.getRandom({ index:'DemonFemale', sex:'futa' });
      let last = NameBuilder.getRandom({ index:'DemonLast', sex:'futa' });
      log(`    Futa Demon Name: ${first.name} ${last.name}`);
    });
  });

  it("gets a random elf female name", function() {
    forUpTo(10, () => {
      let first = NameBuilder.getRandom({ index:'ElfFemale', sex:'female' });
      let last = NameBuilder.getRandom({ index:'ElfLast', sex:'female' });
      log(`    Female Elf Name: ${first.name} ${last.name}`);
    });
  });

  it("gets a random elf male name", function() {
    forUpTo(10, () => {
      let first = NameBuilder.getRandom({ index:'ElfMale', sex:'male' });
      let last = NameBuilder.getRandom({ index:'ElfLast', sex:'male' });
      log(`    Male Elf Name: ${first.name} ${last.name}`);
    });
  });

  it("gets a random elf futa name", function() {
    forUpTo(10, () => {
      let first = NameBuilder.getRandom({ index:'ElfFemale', sex:'futa' });
      let last = NameBuilder.getRandom({ index:'ElfLast', sex:'futa' });
      log(`    Futa Elf Name: ${first.name} ${last.name}`);
    });
  });

  it("gets a random goblin female name", function() {
    forUpTo(10, () => {
      let first = NameBuilder.getRandom({ index:'GoblinFemale', sex:'female' });
      let last = NameBuilder.getRandom({ index:'GoblinLast', sex:'female' });
      log(`    Female Goblin Name: ${first.name} ${last.name}`);
    });
  });

  it("gets a random goblin male name", function() {
    forUpTo(10, () => {
      let first = NameBuilder.getRandom({ index:'GoblinMale', sex:'male' });
      let last = NameBuilder.getRandom({ index:'GoblinLast', sex:'male' });
      log(`    Male Goblin Name: ${first.name} ${last.name}`);
    });
  });

  it("gets a random goblin futa name", function() {
    forUpTo(10, () => {
      let first = NameBuilder.getRandom({ index:'GoblinFemale', sex:'futa' });
      let last = NameBuilder.getRandom({ index:'GoblinLast', sex:'futa' });
      log(`    Futa Goblin Name: ${first.name} ${last.name}`);
    });
  });

  it("gets a random female kobold name", function() {
    forUpTo(10, () => {
      log(`    Female Kobold Name: ${NameBuilder.getRandom({ index:'Kobold', sex:'female' }).name}`);
    });
  });

  it("gets a random male kobold name", function() {
    forUpTo(10, () => {
      log(`    Male Kobold Name: ${NameBuilder.getRandom({ index:'Kobold', sex:'male' }).name}`);
    });
  });

});
