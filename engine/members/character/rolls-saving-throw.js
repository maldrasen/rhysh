global.RollSavingThrow = (function() {

  function roll(actor, save) {
    console.log("Roll Saving Throw",save);
  }

  return { roll };

})()