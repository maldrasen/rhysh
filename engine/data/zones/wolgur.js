
const wolgur = new Zone('wolgur',{
  name: 'Wolgur',
  mapFilePath:`${ROOT}/data/zones/Wolgur.json`,
});

wolgur.setLayers([
  { level:100 },
  { level:101 },
  { level:102 },
  { level:103 },
]);

wolgur.addOrigin('guild', new Vector(61,59,102));
wolgur.addOrigin('tavern', new Vector(60,51,102));
wolgur.addOrigin('store', new Vector(56,65,102));
wolgur.addOrigin('blacksmith', new Vector(63,64,102));
wolgur.addOrigin('wolgur-cleft', new Vector(58,76,102));

wolgur.addExit('wolgur-cleft',{
  visible:true,
  points:[
    new Vector(57,78,102),
    new Vector(58,78,102),
    new Vector(59,78,102),
  ],
});

wolgur.setExtension('A','Event:Wolgur-Blacksmith-Window');
wolgur.setExtension('B','Goto:TownBlacksmith');
wolgur.setExtension('G','Goto:TownGuild');
wolgur.setExtension('S','Goto:TownStore');
wolgur.setExtension('T','Goto:TownTavern');
wolgur.setExtension('Rook','Statue:WolgurFountain');
wolgur.setExtension('Pawn','Statue:GuildHero');
wolgur.setExtension('Point(15,34,101)','Sign:Grotto-A');
wolgur.setExtension('Point(15,37,101)','Sign:Grotto-B');
wolgur.setExtension('Point(18,42,100)','Sign:Grotto-C');
wolgur.setExtension('Point(71,54,103)','Trigger:Tavern-DiscoveredSecretHall');
wolgur.setExtension('Point(76,54,103)','Trigger:Tavern-DiscoveredSlavePens');

Zone.register(wolgur);
