let names = [
  { name:"Angelrape" },
  { name:"Bloodcurse" },
  { name:"Bloodlick" },
  { name:"Bloodscream" },
  { name:'Blightcunt', restriction:'has-pussy'},
  { name:'Blightcock', restriction:'has-cock'},
  { name:"Corpserape" },
  { name:"Deadgod" },
  { name:"Destempre" },
  { name:"Doomsorrow" },
  { name:"Dreadcock", triggers:['big-cock'], restriction:'has-cock'},
  { name:"Fleshcrawl" },
  { name:"Fleshfeast" },
  { name:"Fleshgod" },
  { name:"Fleshgore" },
  { name:"Gorefeast" },
  { name:"Gorerotted" },
  { name:"Graveworm" },
  { name:"Hatescream" },
  { name:"Hatewhisper" },
  { name:"Hellcock", triggers:['monster-cock'], restriction:'has-cock'},
  { name:"Hellfyre" },
  { name:"Hellscream" },
  { name:"Hellspawned" },
  { name:"Moonblood" },
  { name:"Mooncursed" },
  { name:"Moonforest" },
  { name:"Moonsorrow" },
  { name:"Moonspell" },
  { name:"Morningstar" },
  { name:"Mourningstar" },
  { name:"Murdercock", triggers:['big-cock'], restriction:'has-cock'},
  { name:"Murderfuck" },
  { name:"Necroflesh" },
  { name:"Necromonger" },
  { name:"Nifelheim" },
  { name:"Nightrage" },
  { name:"Nordafrost" },
  { name:"Omendark" },
  { name:"Ribspreader" },
  { name:"Riptear" },
  { name:"Rotflesh" },
  { name:"Runemagick" },
  { name:"Slaughtercult" },
  { name:"Slaughterfuck" },
  { name:"Soulshitter", triggers:['revolting.1']},
  { name:"the Cunt Destroyer", triggers:['monster-cock'], restriction:'has-cock'},
  { name:"the Defiled" },
  { name:"the Devourer" },
  { name:"the Festering" },
  { name:"the Pelvis Splitter", triggers:['monster-cock'], restriction:'has-cock'},
  { name:"the Unclean" },
  { name:"Thirdmoon" },
  { name:"Todestriebe" },
  { name:"Tristwood" },
  { name:"Wasterot" },
  { name:"Wolfchant" },
];

names.forEach(name => {
  NameBuilder.addName(name, 'DemonLast');
});
