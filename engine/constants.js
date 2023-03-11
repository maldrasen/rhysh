
global.AttributeNames = {
  str: 'Strength',
  dex: 'Dexterity',
  con: 'Constitution',
  int: 'Intelligence',
  wis: 'Wisdom',
  cha: 'Charisma',
};

// TODO: Replace these with _str
global.STR = 'str';
global.DEX = 'dex';
global.CON = 'con';
global.INT = 'int';
global.WIS = 'wis';
global.CHA = 'cha';

// TODO: Replace these with _N
global.N = "N";
global.S = "S";
global.E = "E";
global.W = "W";
global.U = "U";
global.D = "D";

global.SizeClass = {
  tiny:   { maxSquadSize:16 },
  small:  { maxSquadSize:10 },
  medium: { maxSquadSize:7  },
  large:  { maxSquadSize:3  },
  huge:   { maxSquadSize:1  },
}

// Slots
global._mainHand = 'mainHand';
global._offHand = 'offHand';

global._head = 'head';
global._chest = 'chest';
global._arms = 'arms';
global._feet = 'feet';
global._legs = 'legs';

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
  _arms,
  _legs,
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

// === Target Types ===
global._self = 'self';
global._monster = 'monster';
global._rank = 'rank';
global._allMonsters = 'allMonsters';
global._character = 'character';
global._party = 'party';
global._everyone = 'everyone';

global.TargetTypes = [
  _self,
  _monster,
  _rank,
  _allMonsters,
  _character,
  _party,
  _everyone,
];

