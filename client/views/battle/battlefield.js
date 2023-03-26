window.Battlefield = (function() {

  function buildMonsterList() {
    forUpTo(5, i => {
      let rank = i+1;
      let listElement = X.first(`#targetFrame .rank-${rank}`);
      let fieldElement = X.first(`#battlefield .rank-${rank}`);

      let squad = BattleView.getBattleState().monsters[rank];

      X.empty(listElement);
      X.empty(fieldElement);
      X.addClass(listElement,'empty');

      if (squad) {
        X.removeClass(listElement,'empty');
        listElement.innerHTML = `<span class='count'>${squad.monsters.length}</span> ${squad.name}`;

        squad.monsters.forEach(monster => {
          fieldElement.appendChild(buildMonsterCard(monster))
        });
      }
    });
  }

  function updateMonsterList() {
    console.log("Update Monster List")
  }

  function buildMonsterCard(monster) {
    let monsterCard = X.createElement(`
      <div class='monster-card monster-id-${monster.id}'>
        <div class='name'>${monster.name}</div>
      </div>`);

    monsterCard.style['background-image'] = `url('../assets/${monster.portrait}.jpg')`

    setHealthEffect(monsterCard, monster.health);

    return monsterCard;
  }

  // === Battle Damage =========================================================

  function applyMonsterDamage(round, event) {
    const element = X.first(`#battlefield .monster-id-${round.target.monsterID}`);

    setHealthEffect(element, event.targetHealth);

    if (round.targetCondition == _fainted) { playFaintEffect(element); }
    if (round.targetCondition == _dead) { playDeathEffect(element); }
  }

  function setHealthEffect(element, health) {
    const sepiaStrength = Math.floor((100 - health)/100);
    const contrastStrength = sepiaStrength + 1;

    console.log("Setting Health Effect",element.getAttribute('class'),health)
    console.log('  Sepia Strength',sepiaStrength)
    console.log('  Contrast Strength',contrastStrength)

    element.style['filter'] = `sepia(${sepiaStrength}) hue-rotate(320deg) contrast(${contrastStrength})`;
  }

  function playFaintEffect(element) {
    console.log("Play Faint Effect");
  }

  function playDeathEffect(element) {
    console.log("Play Death Effect");
  }

  return {
    buildMonsterList,
    updateMonsterList,
    applyMonsterDamage,
  }

})();