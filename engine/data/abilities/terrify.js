const terrify = new Ability('terrify',{
  type: _spell,
  spellType: _groupEffect,
  fromPower: 'aura-fear',
  name: 'Horrifying Presence',

  targetType: _allMonsters,
  cooldown: 8,
  savingThrow: { category:_saveFear, dc:10 },
  addStatus: { status:_afraid },
  icon: `../assets/icons/ability-terrify.png`,
});

terrify.addActionStory({ text:`{{A::Name}} unleashes {{A::his}} horrifying presence!` });

Ability.register(terrify);
