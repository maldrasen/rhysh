global.InterruptComputer = class InterruptComputer {

  #combatRound;

  // The Interrupt computer determines if the action that a character had
  // planned to do changes to a different action. There could be several
  // causes. If they are attacking and their arms get grappled that attack
  // changes to a struggle action to break free. Some status effects may cause
  // a character to lose their turn.
  constructor(combatRound) {
    this.#combatRound = combatRound;
  }

  getAction() { return this.#combatRound.getAction(); }

  // Some interrupts will take priority over others. If a character is
  // paralyzed, dead, or fainted they can't be struggling or stumbling around
  // blindly.
  checkForInterrupt() {}

}
