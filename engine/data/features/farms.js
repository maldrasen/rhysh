
FeatureSet.register(new FeatureSet('farms',{
  filePath:`${ROOT}/data/features/farms.json`,
  featureSpecs: [
    { name:'Farm-1-1',  flip:true, x:0,  y:0,  width:7, height:10, depth:1 },
    { name:'Farm-1-2',  flip:true, x:6,  y:0,  width:5, height:8,  depth:1 },
    { name:'Farm-1-3',  flip:true, x:10, y:0,  width:6, height:6,  depth:1 },
    { name:'Farm-1-4',  flip:true, x:10, y:5,  width:6, height:5,  depth:1 },
    { name:'Farm-1-5',  flip:true, x:15, y:0,  width:8, height:9,  depth:1 },
    { name:'Farm-1-6',  flip:true, x:22, y:0,  width:7, height:10, depth:1 },
    { name:'Farm-1-7',  flip:true, x:28, y:0,  width:4, height:6,  depth:1 },
    { name:'Farm-1-8',  flip:true, x:28, y:5,  width:4, height:5,  depth:1 },
    { name:'Farm-1-9',  flip:true, x:0,  y:9,  width:8, height:8,  depth:1 },
    { name:'Farm-1-10', flip:true, x:7,  y:9,  width:9, height:8,  depth:1 },
    { name:'Farm-1-11', flip:true, x:15, y:8,  width:8, height:8,  depth:1 },
    { name:'Farm-1-12', flip:true, x:22, y:9,  width:5, height:7,  depth:1 },
    { name:'Farm-1-13', flip:true, x:26, y:9,  width:6, height:7,  depth:1 },
    { name:'Farm-1-14', flip:true, x:0,  y:16, width:9, height:7,  depth:1 },
    { name:'Farm-1-15', flip:true, x:8,  y:16, width:9, height:7,  depth:1 },
    { name:'Farm-1-16', flip:true, x:16, y:15, width:8, height:8,  depth:1 },
    { name:'Farm-1-17', flip:true, x:23, y:15, width:9, height:8,  depth:1 },
  ],
  extensions: {
    Green: 'farm-house',
    Blue: 'farm-room',
  },
}));
