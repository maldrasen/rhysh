
// === Dungeon =================================================================

global._root = 'root';
global._extra = 'extra';
global._extended = 'extended';

// Facings
global._N = "N";
global._S = "S";
global._E = "E";
global._W = "W";
global._U = "U";
global._D = "D";

// Tile Types
global._tileEmpty = 'tileEmpty';
global._tileSolid = 'tileSolid';
global._tileStairs = 'tileStairs';

global._tileFillStone = 'tileFillStone';
global._tileFillTree = 'tileFillTree';
global._tileFillStatue  = 'tileFillStatue';

global._floorNormal = 'floorNormal';
global._floorWater = 'floorWater';

global._wallNormal = 'wallNormal';
global._wallDoor = 'wallDoor';
global._wallFence = 'wallFence';

global._triggerExit = 'triggerExit';

// === Characters ==============================================================

global._str = 'str';
global._dex = 'dex';
global._con = 'con';
global._int = 'int';
global._wis = 'wis';
global._cha = 'cha';
global.AttributeNames = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
};

// === Sexes ===
global._male = 'male'
global._female = 'female'
global._futa = 'futa'
global._nosex = 'nosex'
global.Sexes = [
  _female,
  _futa,
  _male,
  _nosex,
];

// == Flags (Used on names, armor and monsters) ===
global._lewd = 'lewd';
global._roomy = 'roomy';
global._notFemale = 'notFemale';
global._notMale = 'notMale';
global._hasScales = 'hasScales';
global._hasFur = 'hasFur';
global._hasSkin = 'hasSkin';

// === Archetypes ===
global._chosen = 'chosen';
global._cultist = 'cultist';
global._dominatrix = 'dominatrix';
global._knight = 'knight';
global._mindbender = 'mindbender';
global._slaver = 'slaver';

// === Species ===
global._dragonkind = 'dragonkind';
global._elf = 'elf';
global._lupin = 'lupin';
global._minotaur = 'minotaur';
global._nymph = 'nymph';
global._orc = 'orc';
global._satyr = 'satyr';

global._slowHitGrowth = 'slowHitGrowth';
global._mediumHitGrowth = 'mediumHitGrowth';
global._fastHitGrowth = 'fastHitGrowth';


// === Skills ==================================================================

global._athletics = 'athletics';
global._acrobatics = 'acrobatics';
global._bondage = 'bondage';
global._stealth = 'stealth';
global._history = 'history';
global._wizardry = 'wizardry';
global._mechanics = 'mechanics';
global._perception = 'perception';
global._appraisial = 'appraisial';
global._religion = 'religion';
global._intimidation = 'intimidation';
global._seduction = 'seduction';
global._persuasion = 'persuasion';

global.Skills = {
  athletics:    { attribute:_str }, // Grappling skill is based on athletics
  acrobatics:   { attribute:_dex }, // Getting past some events and perhaps also some sex skills?
  bondage:      { attribute:_dex }, // Tying up, getting untied, and general robe use
  stealth:      { attribute:_dex }, // Hide in shadows chance
  history:      { attribute:_int }, // Knowledge of the old Rhysh empire mostly
  wizardry:     { attribute:_int }, // Success in casting a spell
  mechanics:    { attribute:_int }, // Disarming and setting traps
  perception:   { attribute:_wis }, // Notice things in the dungeon, traps and shit
  appraisial:   { attribute:_wis }, // Get information about mosters and items.
  religion:     { attribute:_wis }, // Not sure, probably useful given we have cultists and shit.
  intimidation: { attribute:_cha }, // Some combat skills also might use intimidation
  seduction:    { attribute:_cha }, // Conversation and general sex skills
  persuasion:   { attribute:_cha }, // Might not use, but might as well include for now.
}

// === Status & Conditions =====================================================

global._normal = 'normal';
global._fainted = 'fainted';
global._dead = 'dead';
global._prone = 'prone';
global._stunned = 'stunned';
global._paralyzed = 'paralyzed';
global._holdingArms = 'holdingArms';
global._holdingBody = 'holdingBody';
global._holdingLegs = 'holdingLegs';

global._fallen = 'fallen';
global._hold = 'hold';
global._helpless = 'helpless';
global.ConditionCategories = [
  _normal,
  _fallen,
  _hold,
  _helpless,
];

// Status

global._afraid = 'afraid';
global._berserk = 'berserk';
global._blind = 'blind';
global._poison = 'poison';

global._boundLegs = 'boundLegs';
global._boundArms = 'boundArms';
global._boundBody = 'boundBody';

global._groinExposed = 'groinExposed';
global._chestExposed = 'chestExposed';

global._defensive = 'defensive';
global._riposte = 'riposte';

// Saving Throw Categories
global._saveAll = 'saveAll';
global._saveFear = 'saveFear';

// === Items & Equipment =======================================================
global._mainHand = 'mainHand';
global._offHand = 'offHand';

global._head = 'head';
global._chest = 'chest';
global._legs = 'legs';
global._hands = 'hands';
global._feet = 'feet';

global._ass = 'ass';
global._back = 'back';
global._cock = 'cock';
global._ear = 'ear';
global._labia = 'labia';
global._neck = 'neck';
global._nipple = 'nipple';
global._pussy = 'pussy';
global._ring = 'ring';
global._mouth = 'mouth';

global.ArmorSlots = [
  _head,
  _chest,
  _legs,
  _hands,
  _feet,
];

global.AccessorySlots = [
  _ass,
  _back,
  _cock,
  _ear,
  _labia,
  _neck,
  _nipple,
  _offHand,
  _pussy,
  _ring,
  _mouth,
];

// Loot Rarities
global._normalQuality = 'normalQuality'
global._uncommonQuality = 'uncommonQuality'
global._rareQuality = 'rareQuality'
global._epicQuality = 'epicQuality'
global._artifactQuality = 'artifactQuality'

// Armor Types
global._cloth = 'cloth';
global._leather = 'leather';
global._hide = 'hide';
global._chain = 'chain';
global._scale = 'scale';
global._plate = 'plate';

// Armor Weights
global._lightArmor = 'lightArmor';
global._mediumArmor = 'mediumArmor';
global._heavyArmor = 'heavyArmor';

// Weapon Modes
global._bash = 'bash';
global._block = 'block';
global._entangle = 'entangle';
global._parry = 'parry';
global._riposte = 'riposte';
global._shoot = 'shoot';
global._slash = 'slash';
global._thrust = 'thrust';

global.WeaponModes = {
  slash:    { hit:0,  damage:0 },
  shoot:    { hit:0,  damage:0 },
  bash:     { hit:-1, damage:2 },
  thrust:   { hit:-2, damage:4 },
  parry:    { special:true },
  riposte:  { special:true },
  entangle: { special:true },
}

// Weapon Type Classes for Generator and determining allowable weapons.
global._byCode = 'byCode';
global._anyWeapons = 'anyWeapons';
global._cultWeapons = 'cultWeapons';
global._closeWeapons = 'closeWeapons';
global._extendedWeapons = 'extendedWeapons';
global._longWeapons = 'longWeapons';
global._mageWeapons = 'mageWeapons';

// === Battle, Actions & Abilities =============================================

global._monsterInitiative = 'monsterInitiative';
global._characterInitiative = 'characterInitiative';

global._monsterActor = 'monsterActor';
global._characterActor = 'characterActor';

global._attack = 'attack';
global._ability = 'ability';
global._nothing = 'nothing';
global.ActionTypes = [
  _attack,
  _ability,
  _nothing,
];

global._coupDeGrace = 'coupDeGrace';
global._grapple = 'grapple';
global._spell = 'spell';
global.AbilityTypes = [
  _attack,
  _coupDeGrace,
  _grapple,
  _hold,
  _spell,
];

global._self = 'self';
global._single = 'single';
global._random = 'random';
global._rank = 'rank';
global._allMonsters = 'allMonsters';
global._allCharacters = 'allCharacters';
global._everyone = 'everyone';
global._none = 'none';
global.TargetTypes = [
  _self,
  _single,
  _random,
  _rank,
  _allMonsters,
  _allCharacters,
  _everyone,
  _none,
];

global._close = 'close';
global._extended = 'extended';
global._long = 'long';
global.Ranges = [
  _close,
  _extended,
  _long,
];

// These keys are used to specify when an ability's setCondition value should
// be applied. These could be used in other places though.
global._always = 'always';
global._success = 'success';
global._failure = 'failure';

// Segment Types and Display Order
global._attempt = 'attempt';
global._hit = 'hit';
global._miss = 'miss';
global._criticalHit = 'criticalHit';
global._criticalMiss = 'criticalMiss';
global._statusChange = 'statusChange';
global._conditionChange = 'conditionChange';
global._trigger = 'trigger';
global.SegmentTypes = [
  _attempt,
  _hit,
  _miss,
  _criticalHit,
  _criticalMiss,
  _statusChange,
  _conditionChange,
  _trigger,
];

// === Monsters ================================================================

// Size Classes
global._tiny = 'tiny';
global._small = 'small';
global._medium = 'medium';
global._large = 'large';
global._huge = 'huge';
global.SizeClasses = {
  tiny:   { maxSquadSize:16 },
  small:  { maxSquadSize:10 },
  medium: { maxSquadSize:7  },
  large:  { maxSquadSize:3  },
  huge:   { maxSquadSize:1  },
}

// Ranks
global._rank_1 = 'rank-1';
global._rank_2 = 'rank-2';
global._rank_3 = 'rank-3';
global._rank_4 = 'rank-4';
global._rank_5 = 'rank-5';
global.SquadRanks = [
  _rank_1,
  _rank_2,
  _rank_3,
  _rank_4,
  _rank_5,
];

// Monster Flags
global.MonsterFlags = [
  _lewd,
]

// === Events ==================================================================

global._selectionStage = 'selectionStage';
global._normalStage = 'normalStage';
