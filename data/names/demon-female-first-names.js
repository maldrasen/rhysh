let names = [
  { name:"Abaddonia" },
  { name:"Abhorrence" },
  { name:"Abygail" },
  { name:"Abysma" },
  { name:"Abyssa" },
  { name:"Anathema" },
  { name:"Angelcorpse" },
  { name:"Anthraxia" },
  { name:"Apocalyptica" },
  { name:"Apoptygma" },
  { name:"Apostrix" },
  { name:"Archondia" },
  { name:"Areola" },
  { name:"Armageddonia" },
  { name:"Asmodrist" },
  { name:"Astarothia" },
  { name:"Asurail" },
  { name:"Atrocitia" },
  { name:"Avarice" },
  { name:"Baphometria" },
  { name:"Beastialitrix", aspects:['beast-lover.3']},
  { name:"Beelzebria" },
  { name:"Behemotha" },
  { name:"Belphegoria" },
  { name:"Blasphemia" },
  { name:"Cadaveria" },
  { name:"Christfuck" },
  { name:"Clitoria", triggers:['monster-clit']},
  { name:"Cloven" },
  { name:"Concubine" },
  { name:"Coven" },
  { name:"Dagondris" },
  { name:"Decarabris" },
  { name:"Defecatris", aspects:['revolting.3']},
  { name:"Demiurge" },
  { name:"Demogorgia" },
  { name:"Demonica" },
  { name:"Depravitrix" },
  { name:"Desecratia" },
  { name:"Deviantrix" },
  { name:"Dismemberia" },
  { name:"Engorgia", triggers:['monster-clit']},
  { name:"Fellatia" },
  { name:"Gehenna" },
  { name:"Glasya" },
  { name:"Gonorrhea" },
  { name:"Gorgorothia" },
  { name:"Hecate" },
  { name:"Ifris" },
  { name:"Iniquitrix" },
  { name:"Legionia" },
  { name:"Leviathis" },
  { name:"Leviacunt", triggers:['monster-pussy']},
  { name:"Leviticunt", triggers:['big-pussy']},
  { name:"Lilith" },
  { name:"Lucifix" },
  { name:"Macabrix" },
  { name:"Malapharia" },
  { name:"Malepharis" },
  { name:"Malluarica" },
  { name:"Malphasia" },
  { name:"Manowaria" },
  { name:"Massacra" },
  { name:"Mephistophelia" },
  { name:"Metalica" },
  { name:"Minotauria", triggers:['big-tits']},
  { name:"Monstrositia" },
  { name:"Moraxia" },
  { name:"Mutilatrix" },
  { name:"Mütilatia" },
  { name:"Nargarotha" },
  { name:"Nazareth" },
  { name:"Necromandia" },
  { name:"Necromantia" },
  { name:"Nightwish" },
  { name:"Nirvana" },
  { name:"Obituaria" },
  { name:"Pagantrim" },
  { name:"Pantera" },
  { name:"Pentagramia" },
  { name:"Pentangle" },
  { name:"Profanatica" },
  { name:"Rangda" },
  { name:"Revengea" },
  { name:"Sabbatia" },
  { name:"Sacramentrix" },
  { name:"Sacrificium" },
  { name:"Sadistix" },
  { name:"Samaelia" },
  { name:"Samigina" },
  { name:"Sanctifica" },
  { name:"Sarcófagia" },
  { name:"Satanica" },
  { name:"Satrix" },
  { name:"Scarificatia" },
  { name:"Sigtrygg" },
  { name:"Sirenia" },
  { name:"Sitri" },
  { name:"Sodomistress" },
  { name:"Sturmgeisterdamen" },
  { name:"Syphili" },
  { name:"Syphilis" },
  { name:"Tiamat" },
  { name:"Tormentrix" },
  { name:"Unholy" },
  { name:"Valeforia" },
  { name:"Vapula" },
];

names.forEach(name => {
  Name.add(name, { species:'demon', position:'first', restriction:'not-male' });
});
