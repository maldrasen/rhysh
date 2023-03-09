// A Scrutinizer is used to check to see if a set of conditions are true. The
// requires argument can be a string or an array of strings. If the context
// is null a new context will be built by the Scrutinizer. Requires can have
// the following forms:
//
//   single requirements:    'flag.cock=huge'
//   and requirements:       ['flag.tits=huge','flag.cock=huge']
//   or requirements:        [{ or:['flag.anus=huge','flag.pussy=huge'] }]
//   and/or requirements:    ['flag.cock=huge',{ or:['flag.anus=huge','flag.pussy=huge'] }]
//
// There's no further nesting of more ands inside of ors though. This isn't
// recursive, and I don't think we'll get to that level of complexity with
// requirement checking, or if we do there should be some other way to
// implement what's needed.
//
// Specific requirement formats are explained in their respective
// scrutinizers, though for the most part they're very simple and
// self-explanitory.

global.Scrutinizer = class Scrutinizer {

  #context
  #state

  constructor(context = null) { this.#context = context; }
  setContext(context) { this.#context = context; }
  setState(state) { this.#state = state; }

  meetsRequirements(requires) {
    if (requires == null || requires.length == 0) { return true; }

    let requirements = (typeof requires == "string") ? [requires] : requires;

    return requirements.map(requirement => {
      return requirement.or ?
        ( this.meetsOrRequirements(requirement.or)):
        ( this.meetsRequirement(requirement));
    }).indexOf(false) < 0;
  }

   meetsOrRequirements(requirements) {
    return requirements.map( requirement => {
      return  this.meetsRequirement(requirement);
    }).indexOf(true) >= 0;
  }

   meetsRequirement(requirement) {
    if (requirement == 'TRUE') { return true; }
    if (requirement == 'FALSE') { return false; }

    if (requirement.match(/^flag/))    { return this.checkFlag(requirement); }
    if (requirement.match(/^no-flag/)) { return this.checkFlagNotExists(requirement); }
    if (requirement.match(/^state/))   { return this.checkState(requirement); }
    if (requirement.match(/^actor/))   { return CharacterScrutinizer.check(requirement); }
    if (requirement.match(/^player/))  { return CharacterScrutinizer.check(requirement); }
    if (requirement.match(/^attack/))  { return BattleScrutinizer.check(requirement, this.#context); }
    if (requirement.match(/^monster/)) { return BattleScrutinizer.check(requirement, this.#context); }
    if (requirement.match(/^target/))  { return BattleScrutinizer.check(requirement, this.#context); }

    throw `Unknown Requirement - ${requirement}`;
  }

  // This function is used by any requirement check that needs to compare two
  // values. A RegEx like ([^<>=]+)(<|<=|=|>=|>)([^<>=]+) can be used to get
  // two values on either side of a comparison operation.
  static checkComparisonOperation(leftValue, operation, rightValue) {
    if (operation == '<=') { return parseInt(leftValue) <= parseInt(rightValue); }
    if (operation == '>=') { return parseInt(leftValue) >= parseInt(rightValue); }
    if (operation == '<')  { return parseInt(leftValue) < parseInt(rightValue); }
    if (operation == '>')  { return parseInt(leftValue) > parseInt(rightValue); }
    return leftValue == rightValue;
  }

  // Requirements Like: flag.cock=horse, or flag.dicksSucked>=37
  checkFlag(requirement) {
    let match = requirement.match(/^flag\.([^<>=]+)(<|<=|=|>=|>)([^<>=]+)/);
    if (match == null) {
      return this.checkFlagExists(requirement);
    }

    let value = Flag.get(match[1]);
    return (value == null) ? false : Scrutinizer.checkComparisonOperation(value, match[2], match[3]);
  }

  checkFlagExists(requirement) {
    return Flag.get(requirement.match(/^flag\.(.+)/)[1]) != null;
  }

  checkFlagNotExists(requirement) {
    return Flag.get(requirement.match(/^no-flag\.(.+)/)[1]) == null;
  }

  // Requirements Like: state.sex=filthy, or state.gallonsOfCum>30
  checkState(requirement) {
    let match = requirement.match(/^state\.([^<>=]+)(<|<=|=|>=|>)([^<>=]+)/);
    return Scrutinizer.checkComparisonOperation(this.#state[match[1]], match[2], match[3]);
  }
}
