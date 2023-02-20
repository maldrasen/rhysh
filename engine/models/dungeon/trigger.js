global.Trigger = class Trigger {

  static Type = {
    Exit: 0,
  }

  constructor(options) {
    this.type = options.type;
    if (options.exitOptions) { this.exitOptions = options.exitOptions; }
  }

  static exit(options) {
    return new Trigger({
      type: Trigger.Type.Exit,
      exitOptions: options,
    });
  }

  isExit() { return this.type == Trigger.Type.Exit }

  static unpack(data) {
    return new Trigger(data);
  }

  forClient() {
    let trigger = {
      type: ObjectHelper.reverseLookup(Trigger.Type, this.type),
    };

    if (this.exitOptions) { trigger.exitOptions = this.exitOptions; }

    return trigger;
  }


}


