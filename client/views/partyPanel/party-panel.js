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
    X.removeClass('#statusPanel','hide')
    X.removeClass('#partyPanel','hide')
    update(status);
  }

  function hide() {
    X.addClass('#statusPanel','hide')
    X.addClass('#partyPanel','hide')
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
    element.querySelector('.health-bar .bar').style['width'] = `${hitPercent}%`;
    element.querySelector('.name').innerHTML = status.firstName;

    Tooltip.register(`PartyPanel_Status_${element.id}`, {
      content: `Health(${hpCurrent}/${hpMax}) Mana(TODO)`,
      position: 'top',
    });
  }

  return {
    init,
    reset,
    show,
    hide,
    update,
  }

})();
