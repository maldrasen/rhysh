let names = [
  { name:'Amberleaf' },
  { name:'Ambersky' },
  { name:'Araventer' },
  { name:'Arrowswift' },
  { name:'Ashenvale' },
  { name:'at the Gate' },
  { name:'Autumnlight' },
  { name:'Barrows' },
  { name:'Bearmantle', triggers:['strong']},
  { name:'Berry' },
  { name:'Blackbear' },
  { name:'Blackleaf' },
  { name:'Blackriver' },
  { name:'Blackwolf' },
  { name:'Blight' },
  { name:'Bloomthistle' },
  { name:'Bonechewer', aspects:['violent.3']},
  { name:'Bramble' },
  { name:'Brier' },
  { name:'Brierborn' },
  { name:'Briers' },
  { name:'Brightfang', aspects:['violent.2']},
  { name:'Brightmoon' },
  { name:'Brightwood' },
  { name:'Cliffton' },
  { name:'Cloudpath' },
  { name:'Cross' },
  { name:'Crown' },
  { name:'Darkhollow' },
  { name:'Darksky' },
  { name:'Deeper' },
  { name:'Denneventner' },
  { name:'Duskgrove' },
  { name:'Farrowdeep' },
  { name:'Feathermoon' },
  { name:'Fielder' },
  { name:'Fields' },
  { name:'Fox' },
  { name:'Gatekeeper' },
  { name:'Gatewatcher' },
  { name:'Goldshadow' },
  { name:'Goodberry' },
  { name:'Greenleaf' },
  { name:'Greenleaf' },
  { name:'Greenwood' },
  { name:'Greywarden' },
  { name:'Greywatcher' },
  { name:'Grimclaw', aspects:['violent.2']},
  { name:'Grimfang', aspects:['violent.2']},
  { name:'Hart' },
  { name:'Highfisher' },
  { name:'Highlander' },
  { name:'Highranger' },
  { name:'Hope' },
  { name:'Howling Rock' },
  { name:'Ironman', restriction:'male'},
  { name:'Irons' },
  { name:'Irontowner' },
  { name:'Lightleaf' },
  { name:'Mapleheart' },
  { name:'Mistdancer' },
  { name:'Mistwarden' },
  { name:'Moonbreeze' },
  { name:'Moonfeather' },
  { name:'Moonrage' },
  { name:'Moonsong' },
  { name:'Moss' },
  { name:'Mossglow', triggers:['magical']},
  { name:'Nettlepatch' },
  { name:'Nightsong' },
  { name:'Nightwhisper' },
  { name:'Nightwing' },
  { name:'Nightwish' },
  { name:'Northfield' },
  { name:'Northman', restriction:'male'},
  { name:'Oakenbough' },
  { name:'of Farrowdeep' },
  { name:'of Goodberry' },
  { name:'of Iron' },
  { name:'of Olendalia' },
  { name:'of Silk' },
  { name:'of Silver' },
  { name:'of Stone' },
  { name:'of the Blightwood' },
  { name:'of the Crossroads' },
  { name:'of the Greenwood' },
  { name:'of the Southmarket' },
  { name:'Olendalier' },
  { name:'Perch' },
  { name:'Raindancer' },
  { name:'Ravenclaw' },
  { name:'Raveneye' },
  { name:'Redleaf' },
  { name:'Redlight' },
  { name:'Redwood' },
  { name:'Rhysh' },
  { name:'Rockstalker' },
  { name:'Rushwater' },
  { name:'Rust' },
  { name:'Rusty' },
  { name:'Sharptalon' },
  { name:'Silk' },
  { name:'Silker' },
  { name:'Silkman', restriction:'male'},
  { name:'Silks' },
  { name:'Silktowner' },
  { name:'Silver' },
  { name:'Silvered' },
  { name:'Silverlight' },
  { name:'Silverman', restriction:'male'},
  { name:'Silveroak' },
  { name:'Silverpine' },
  { name:'Silverton' },
  { name:'Skullkin' },
  { name:'Skyclad', triggers:['beautiful']},
  { name:'Skydancer' },
  { name:'Skymane' },
  { name:'Skyshadow' },
  { name:'Skysong' },
  { name:'Southfield' },
  { name:'Southman', restriction:'male'},
  { name:'Southmarket' },
  { name:'Springlight' },
  { name:'Springsong' },
  { name:'Stagheart' },
  { name:'Staghelm' },
  { name:'Starbreeze' },
  { name:'Starseeker' },
  { name:'Stone' },
  { name:'Stoned' },
  { name:'Stoneman', restriction:'male'},
  { name:'Stoner' },
  { name:'Stonetalon' },
  { name:'Stonetower' },
  { name:'Stonetowner' },
  { name:'Stonetree' },
  { name:'Stonetree' },
  { name:'Stormrage', triggers:['magical']},
  { name:'Swiftriver' },
  { name:'Tailchaser', aspects:['slut.2']},
  { name:'Thistlewood' },
  { name:'Trevarten' },
  { name:'Valleyman', restriction:'male'},
  { name:'Whitewater' },
  { name:'Willowfall' },
  { name:'Windsinger' },
  { name:'Wolfrider', triggers:['strong']},
  { name:'Wolfrunner' },
  { name:"Ashenscale", triggers:['gray-scales'], restriction:'has-scales'},
  { name:"Duskscale", triggers:['gray-scales'], restriction:'has-scales'},
  { name:"Flamescale", triggers:['red-scales'], restriction:'has-scales'},
  { name:"Goldenscale", triggers:['gold-scales'], restriction:'has-scales'},
  { name:"No'Rhysh" },
  { name:"o'Iron" },
  { name:"o'Silk" },
  { name:"o'Silver" },
  { name:"o'Stone" },
  { name:"Shadowscale", triggers:['black-scales'], restriction:'has-scales'},
  { name:"Snowscale", triggers:['white-scales'], restriction:'has-scales'},
  { name:"So'mark" },
  { name:"So'Rhysh" },
  { name:"Sunscale", triggers:['gold-scales'], restriction:'has-scales'},
  { name:"the Cum Fountain", triggers:['monster-balls'], restriction:'male'},
  { name:"the Deformed", triggers:['ugly'], restriction:'male'},
  { name:"the Drafthorse", triggers:['tall','strong','monster-cock','horse-cock','big-balls'], restriction:'male'},
  { name:"the Elephant", triggers:['ugly','monster-cock'], restriction:'male'},
  { name:"the Fool", triggers:['stupid'], restriction:'male'},
];

names.forEach(name => {
  Name.add(name, { species:'elf', position:'last' });
});