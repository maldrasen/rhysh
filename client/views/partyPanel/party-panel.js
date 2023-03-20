window.PartyPanel = (function () {

  let $currentStatus;

  function init() {
    X.each('#partyPanel .character-frame', frame => {
      frame.innerHTML = `
        <div class='portrait'>
          <div class='name'></div>
          <div class='condition'></div>
          <div class='statusEffects'></div>
        </div>
        <div id='${`PartyPanel_Status_${frame.id}`}' class='status tooltip-parent'>
          <div class='health-bar status-bar'><div class='bar'></div><div class='back'></div></div>
          <div class='mana-bar status-bar'><div class='bar'></div><div class='back'></div></div>
        </div>
      `;
    });
  }

  function reset() {
    X.addClass('#partyPanel','hide');
    $currentStatus = null;
  }

  function show(status) {
    X.removeClass('#statusPanel','hide');
    X.removeClass('#partyPanel','hide');
    update(status);
  }

  function hide() {
    X.addClass('#statusPanel','hide');
    X.addClass('#partyPanel','hide');
  }

  function update(status) {
    $currentStatus = status;

    console.log("Update Status: ",$currentStatus);

    X.first('#statusPanel .right').innerHTML = `
      <span class='day'>${$currentStatus.dayName},</span>
      <span class='time'>${$currentStatus.timeOfDay}</span>`;

    X.first('#statusPanel .left').innerHTML = `
      <span class='location'>${$currentStatus.location}</span>`;

    updateCharacter('main');
  }

  function updateCharacter(position) {
    let element = X.first('#partyPanel #main');
    let status = $currentStatus.party.main;

    let hpCurrent = status.condition.currentHitPoints;
    let hpMax = status.condition.maxHitPoints;
    let hitPercent = Math.ceil(100 * (hpCurrent / hpMax));

    element.querySelector('.portrait').style['background-image'] = `url('../assets/${status.portrait}.jpg')`;
    element.querySelector('.name').innerHTML = status.firstName;

    updateHealthBar(element, hitPercent)
    updateStatusTooltip(element.id, hpCurrent, hpMax);
  }

  function applyCharacterDamage(segment) {
    let element = X.first(`#partyPanel #${segment.characterPosition}`);

    updateHealthBar(element, segment.targetHealth);
    updateStatusTooltip(element.id, segment.targetHitPoints, segment.targetMaxHitPoints);

    if (segment.targetCondition == _fainted) { playFaintEffect(element); }
    if (segment.targetCondition == _dead) { playDeathEffect(element); }
  }

  function updateHealthBar(element, percent) {
    element.querySelector('.health-bar .bar').style['width'] = `${percent}%`;
  }

  function updateStatusTooltip(id, hpCurrent, hpMax) {
    Tooltip.register(`PartyPanel_Status_${id}`, {
      content: `Health(${hpCurrent}/${hpMax}) Mana(TODO)`,
      position: 'top',
    });
  }

  function playFaintEffect(element) {
    console.log("Play Faint Effect");
  }

  function playDeathEffect(element) {
    console.log("Play Death Effect");
  }


  return {
    init,
    reset,
    show,
    hide,
    update,
    applyCharacterDamage,
  }

})();
