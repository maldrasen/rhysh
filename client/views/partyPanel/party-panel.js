window.PartyPanel = (function () {

  let $currentStatus;

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

    console.log("Show",$currentStatus);

    updateCharacter('main');

  }

  function updateCharacter(position) {
    let element = X.first('#partyPanel #main');
    let status = $currentStatus.party.main;
    // TODO: Change element and status if companion.

    element.style['background-image'] = `url('../assets/portraits/${status.portrait}.jpg')`;
  }

  return {
    show,
    hide,
    update,
  }

})();
