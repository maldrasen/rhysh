
global.AttributeNames = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
};

global._str = 'str';
global._dex = 'dex';
global._con = 'con';
global._int = 'int';
global._wis = 'wis';
global._cha = 'cha';

global.AttributeLabels = {
  str:'Strength',
  dex:'Dexterity',
  con:'Constitution',
  int:'Intelligence',
  wis:'Wisdom',
  cha:'Charisma',
}

global._N = "N";
global._S = "S";
global._E = "E";
global._W = "W";
global._U = "U";
global._D = "D";

// === Sexes ===

global._male = 'male'
global._female = 'female'
global._futa = 'futa'

global.Sexes = [
  _female,
  _futa,
  _male,
];

// === Size Classes ===

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

// === Conditions ===

global._normal = 'normal';
global._fainted = 'fainted';
global._dead = 'dead';

global._prone = 'prone';
global._stunned = 'stunned';
global._holdingArms = 'holdingArms';
global._holdingBody = 'holdingBody';
global._holdingLegs = 'holdingLegs';

// === Slots ===
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
];

// === Action Types ===

global._attack = 'attack';
global._ability = 'ability';
global._nothing = 'nothing';

global.ActionTypes = [
  _attack,
  _ability,
  _nothing,
];

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

// === Target Types ===

global._self = 'self';
global._monster = 'monster';
global._rank = 'rank';
global._allMonsters = 'allMonsters';
global._character = 'character';
global._party = 'party';
global._everyone = 'everyone';
global._none = 'none';

global.TargetTypes = [
  _self,
  _monster,
  _rank,
  _allMonsters,
  _character,
  _party,
  _everyone,
  _none,
];

// === Ranges ===

global._close = 'close';
global._extended = 'extended';
global._long = 'long';

// === Monster Flags ===

global._lewd = 'lewd';


// === Segment Types and Display Order ===

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
