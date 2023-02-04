
// --- Both Pre Names ---

let names = [
  { name:'Blighter' },
  { name:"Clever", triggers:['smart']},
  { name:"Crazy", triggers:['stupid']},
  { name:'Grovetender' },
  { name:'Reveler' },
  { name:'Sleepwatcher' },
  { name:'Stony' },
];

names.forEach(name => {
  Name.add(name, { species:'elf', position:'pre' });
});

// --- Female Pre Names ---

names = [
  { name:'Silken' },
  { name:"Fair", triggers:['beautiful','light-skin']},
  { name:"Foxy", triggers:['beautiful','dark-skin']},
  { name:"Lil'", triggers:['short','thin','small-tits']},
  { name:"Little", triggers:['short','thin','small-tits']},
  { name:"Lovely", triggers:['beautiful']},
  { name:"Milky", aspects:['milky'], triggers:['big-tits']},
  { name:"Ridiculous", triggers:['stupid']},
  { name:"Splendid", triggers:['beautiful']},
  { name:"Tiny", triggers:['short','thin','small-tits']},
];

names.forEach(name => {
  Name.add(name, { species:'elf', position:'pre', restriction:'not-male' });
});

// --- Male Pre Names ---
names = [
  { name:"Balls", triggers:['monster-balls']},
  { name:"Big", triggers:['tall','strong','thicc','big-cock']},
  { name:"Black", triggers:['dark-skin','big-cock']},
  { name:"Clever", triggers:['smart']},
  { name:"Cocks", triggers:['multi-cock']},
  { name:"Colt", triggers:['horse-cock']},
  { name:"Crafty", triggers:['smart']},
  { name:"Cunning", triggers:['smart']},
  { name:"Dapper", triggers:['smart','beautiful']},
  { name:"Dicks", triggers:['multi-cock']},
  { name:"Dim", triggers:['stupid']},
  { name:"Drillbit", triggers:['strong','big-cock']},
  { name:"Flaming", aspects:['androphilic'], triggers:['red-hair','big-cock']},
  { name:"Gorgeous", triggers:['beautiful']},
  { name:"Hacksaw", triggers:['strong']},
  { name:"Handsome", triggers:['beautiful']},
  { name:"Hideous", triggers:['ugly']},
  { name:"Horse", triggers:['tall','strong','big-cock','horse-cock','big-balls']},
  { name:"Jackhammer", triggers:['strong','big-cock']},
  { name:"Loathsome", triggers:['ugly']},
  { name:"Misshapen", triggers:['ugly']},
  { name:"Nasty", triggers:['ugly']},
  { name:"Scrotum", triggers:['monster-balls']},
  { name:"Tall", triggers:['tall']},
  { name:"Thirdleg", triggers:['monster-cock']},
  { name:"Wise Old", triggers:['smart','ugly']},
]

names.forEach(name => {
  Name.add(name, { species:'elf', position:'pre', restriction:'male' });
});
