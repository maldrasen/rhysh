window.Battlefield = (function() {

  function updateMonsterList() {
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

  function buildMonsterCard(monster) {
    let monsterCard = X.createElement(`
      <div class='monster-card'>
        <div class='name'>${monster.name}</div>
      </div>`);

    monsterCard.style['background-image'] = `url('../assets/${monster.portrait}.jpg')`


    return monsterCard;
  }

  return {
    updateMonsterList,
  }

})();