global.Model = class Model {

  // Probably the grognardliest piece of code in the game. It pushes the ugly
  // sequalize model instance into the back and defines proxy methods to access
  // the sequalize model, allowing the model classes to be written like normal
  // javascript classes. While it makes the models cleaner, it does an yet
  // another layer of abstraction, but then YALA!

  constructor(instance) {
    this.instance = instance;

    Object.defineProperty(this, 'id', {
      get: () => { return this.instance.id; },
    });

    each(this.constructor.schema, (_,key) => {
      Object.defineProperty(this, key, {
        get: () => { return this.instance[key]; },
        set: (value) => { this.instance[key] = value; }
      });
    });
  }

  static async buildProxy(table, schema, options = {}) {
    this.schema = schema;
    this.proxy = Database.instance().define(table, schema, Object.assign(options,{ timestamps: false }));
    await Database.instance().sync();
  }

  static async create(options) {
    return new this.prototype.constructor(await this.proxy.create(options));
  }

  static async lookup(id) {
    let instance = await this.proxy.findByPk(id);
    return instance ? new this.prototype.constructor(instance) : null;
  }

  static async findOne(options) {
    let instance = await this.proxy.findOne(options);
    return instance ? new this.prototype.constructor(instance) : null;
  }

  static async findAll(options) {
    return (await this.proxy.findAll(options)).map(instance => {
      return new this.prototype.constructor(instance);
    });
  }

  static async destroy(options) { return await this.proxy.destroy(options); }

  async destroy() { await this.instance.destroy(); }
  async save() { await this.instance.save(); }
  async update(values) { await this.instance.update(values); }

  // Model objects need to be serialized into plain javascript objects before
  // they're sent to the client. Everything but the instance itself and
  // function properties (if there are any) should be serialized. Other
  // functions can overwrite this too if more data than this should be included.
  get properties() {
    let props = {};

    each(Object.getOwnPropertyNames(this), name => {
      if (name != 'instance' && typeof this[name] != 'function') {
        props[name] = this[name];
      }
    });

    return props;
  }

  // Sequalize models are huge and shitty when printed out to the console. By
  // overwriting the inspect function we can change how node prints the model
  // but NodeJS is weird about how it defines methods using symbols.
  [util.inspect.custom](depth, opts) {
    let string = `[ ${this.constructor.name} |${this.id}| `;

    each(this.properties, (value, key) => {
      if (key != 'id' && value != null) {
        string += (typeof value == 'string') ? `${key}:"${value}" ` : `${key}:${value} `;
      }
    })

    return `${string}]`;
  }

}
