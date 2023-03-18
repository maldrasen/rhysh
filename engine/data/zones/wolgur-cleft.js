
const wolgurCleft = new Zone('wolgur-cleft',{
  name: 'The Wolgur Cleft',
  mapFilePath:`${ROOT}/data/zones/WolgurCleft.json`,
});

wolgurCleft.setLayers([
  { level:102 },
  { level:103 },
  { level:104 },
  { level:105 },
]);

wolgurCleft.setRegions({
  R:'DamageField',
  G:'CarvePoints',
});

wolgurCleft.addOrigin('wolgur', new Vector(49,1,102));
wolgurCleft.addOrigin('revel-grove', new Vector(1,115,103));
wolgurCleft.addOrigin('howling-glen', new Vector(94,66,103));
wolgurCleft.addOrigin('wolgur-passage', new Vector(62,154,104));

wolgurCleft.addBiome('Orange', {
  biomeName: 'Cleft',
  featureDensity: 0.005,
  extraBuilders: [
    { type:'Bulldozer', phase:'Last', startPoint:new Vector(35,29,102), direction:_E },
    { type:'Bulldozer', phase:'Last', startPoint:new Vector(84,66,103), direction:_W },
  ]
});

wolgurCleft.addBiome('LightGreen', {
  biomeName: 'Farm',
  treeCount: 66,
  houseCount: 4,
});

wolgurCleft.addBiome('Green',{
  biomeName: 'Farm',
  treeCount: 50,
  houseCount: 16,
});

wolgurCleft.addExit('wolgur',{
  visible: true,
  points:[
    new Vector(48,0,102),
    new Vector(49,0,102),
    new Vector(50,0,102),
  ],
});

wolgurCleft.addExit('revel-grove',{
  visible: true,
  points:[
    new Vector(0,114,103),
    new Vector(0,115,103),
    new Vector(0,116,103),
  ],
});

wolgurCleft.addExit('howling-glen',{
  visible: true,
  points:[
    new Vector(95,65,103),
    new Vector(95,66,103),
    new Vector(95,67,103),
  ],
});

wolgurCleft.addExit('wolgur-passage',{
  visible: true,
  points:[
    new Vector(60,155,104),
    new Vector(61,155,104),
    new Vector(62,155,104),
    new Vector(63,155,104),
    new Vector(64,155,104),
  ],
});

wolgurCleft.setExtension('Rook','Statue:WolgurGuardian');

Zone.register(wolgurCleft);
