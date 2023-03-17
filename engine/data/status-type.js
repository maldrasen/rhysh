const StatusDictionary = {}

global.StatusType = class Condition {

  static register(status) {
    StatusDictionary[status.code] = status;
  }

  static lookup(code) {
    if (StatusDictionary[code] == null) { throw `Unknown Status Type: ${code}` }
    return StatusDictionary[code];
  }

  #code;
  #adjustArmorClass;
  #dexPenalty;
  #prevent;

  constructor(code, options) {
    this.#code = code;
    this.#adjustArmorClass = options.adjustArmorClass;
    this.#dexPenalty = options.dexPenalty;
    this.#prevent = options.prevent;
  }

  get code() { return this.#code; }
  get adjustArmorClass() { return this.#adjustArmorClass; }
  get dexPenalty() { return this.#dexPenalty; }
  get prevent() { return this.#prevent; }

}

StatusType.register(new StatusType('defensive',{ adjustArmorClass:4 }));
StatusType.register(new StatusType('riposte',{ adjustArmorClass:2 }));

// TODO: This is still just a guess on how status will work. I know the bound
//       status will prevent some abilities but not all of them. So we need a
//       way to determine which abilities are blocked by what binds.
StatusType.register(new StatusType('bound-legs',{ prevent:'use-of-legs', dexPenalty:-2 }));
StatusType.register(new StatusType('bound-arms',{ prevent:'use-of-arms', dexPenalty:-4 }));
StatusType.register(new StatusType('bound-body',{ prevent:'use-of-body', dexPenalty:-6 }));

// The chest or leg armor has been stripped off or destroyed somehow. These
// status effects don't prevent any actions, but influence story and
// monster ability selection.
StatusType.register(new StatusType('groin-exposed',{}));
StatusType.register(new StatusType('chest-exposed',{}));
