global.WeaponAttackStoryTeller = class WeaponAttackStoryTeller {

  #result

  constructor(result) {
    this.#result = result;
  }

  tellStory() {
    try {
      return {
        bash: () =>   { return this.tellBashStory() },
        shoot: () =>  { return this.tellShootStory() },
        slash: () =>  { return this.tellSlashStory() },
        thrust: () => { return this.tellThrustStory() },
      }[this.#result.getWeaponMode()]();
    } catch(error) {
      return `[Story Teller Error : ${error}]`
    }
  }

  tellBashStory() {
    return `(TODO: Bash Story)`
  }

  tellShootStory() {
    return `(TODO: Shoot Story)`
  }

  tellSlashStory() {
    return `(TODO: Slash Story)`
  }

  tellThrustStory() {
    return `(TODO: Thrust Story)`
  }

}