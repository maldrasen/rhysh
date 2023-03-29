window.Battlefield = (function() {

  function init() {
    X.onResize(BattleView.isOpen, positionMonsterCards);
  }

  function buildMonsterCards() {
    const fieldElement = X.first(`#battlefield`);

    forUpTo(5, i => {
      let rank = i+1;
      let listElement = X.first(`#targetFrame .rank-${rank}`);
      let squad = BattleView.getBattleState().monsters[rank];

      if (squad) {
        X.removeClass(listElement,'empty');
        listElement.innerHTML = `<span class='count'>${squad.monsters.length}</span> ${squad.name}`;

        squad.monsters.forEach(monster => {
          fieldElement.appendChild(buildMonsterCard(monster))
        });
      }
    });
  }

  function buildMonsterCard(monster) {
    let element = X.createElement(`
      <div class='monster-card monster-id-${monster.id}'>
        <div class='layer cover-layer'></div>
        <div class='layer text-layer'>
          <div class='name'>${monster.name}</div>
        </div>
        <div class='layer background-layer'></div>
      </div>`);

    setBackground(element, monster.portrait);
    setHealthEffect(element, monster.health);

    console.log(element)

    return element;
  }

  function setBackground(element, portrait) {
    element.querySelector('.background-layer').style['background-image'] = `url('../assets/${portrait}.jpg')`;
  }

  function positionMonsterCards() {
console.log("Position Monster Cards");
  }

  function updateMonsterCards() {

console.log("Update Monster Cards");

    // console.log("Update Monster List")
  }


  // === Battle Damage =========================================================

  function applyMonsterDamage(round, event) {
    const element = X.first(`#battlefield .monster-id-${round.target.monsterID}`);
    const cover = element.querySelector('.effect-cover');
    const position = X.getPosition(element);

    setHealthEffect(element, event.targetHealth);

    console.log("POSITION:",position)

    cover.setAttribute('style',`
      background-color: rgb(255,0,0);
      top: -1px;
      left: -1px;
      height: ${position.height}px;
      width: ${position.width}px;
    `);

      // top: ${position.top}px;
      // left: ${position.left}px;

    setTimeout(() => {
      cover.style['opacity'] = '0';
    },0);

    setTimeout(() => {
      if (round.targetCondition == _fainted) { playDeathEffect(element); }
      if (round.targetCondition == _dead) { playDeathEffect(element); }
    },200)
  }

  function setHealthEffect(element, health) {
    const sepiaStrength = (100 - health) / 100;
    const contrastStrength = sepiaStrength + 1;

    console.log("Setting Health Effect",element.getAttribute('class'),health)
    console.log('  Sepia Strength',sepiaStrength)
    console.log('  Contrast Strength',contrastStrength)

    element.style['filter'] = `sepia(${sepiaStrength}) hue-rotate(320deg) contrast(${contrastStrength})`;
  }

  function playDeathEffect(element) {
    console.log("Play Death Effect");

    element.style['transition-duration'] = `1000ms`
    element.style['opacity'] = `0`
    element.style['top'] = `20px`
    element.style['margin'] = `0 -60px`
  }

  return {
    init,
    buildMonsterCards,
    updateMonsterCards,
    applyMonsterDamage,
  }

})();