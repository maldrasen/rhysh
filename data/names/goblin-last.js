let names = [
  { name:"Arseface", triggers:['ugly']},
  { name:"Assbiter", aspects:['violent']},
  { name:"Asseater", aspects:['ass-obsessed.2','revolting']},
  { name:"Assfister", aspects:['ass-obsessed.2','stretcher.2']},
  { name:"Assfucker", aspects:['ass-obsessed.3']},
  { name:"Asskicker", aspects:['violent']},
  { name:"Asskisser", aspects:['violent']},
  { name:"Asspacker", aspects:['ass-obsessed.3']},
  { name:"Assripper", aspects:['ass-obsessed.3','stretcher.2'], triggers:['monster-cock'], restriction:'has-cock'},
  { name:"Asswiper", aspects:['ass-obsessed.2','revolting']},
  { name:"Asswipper", aspects:['violent','dominant']},
  { name:"Axechopper", aspects:['violent']},
  { name:"Axefucker", aspects:['violent']},
  { name:"Backpussy", aspects:['anal-slut']},
  { name:"Battlepounder", aspects:['violent']},
  { name:"Battlestabber", aspects:['violent']},
  { name:"Bitchfister", aspects:['gynephilic','stretcher.2']},
  { name:"Bitchfucker", aspects:['gynephilic']},
  { name:"Bitchslapper", aspects:['gynephilic','violent','dominant']},
  { name:"Bitchspanker", aspects:['gynephilic','violent','dominant']},
  { name:"Blooddrinker", aspects:['violent']},
  { name:"Bloodfucker", aspects:['violent']},
  { name:"Bloodshitter", aspects:['violent']},
  { name:"Bloodstabber", aspects:['violent']},
  { name:"Bonefucker" },
  { name:"Bonegrinder" },
  { name:"Boneshitter" },
  { name:"Bulldozer", aspects:['violent']},
  { name:"Butsecks", aspects:['ass-obsessed.3']},
  { name:"Clitcock", triggers:['monster-clit'], restriction:'has-pussy'},
  { name:"Cockfister", aspects:['androphilic','stretcher.3']},
  { name:"Cockfucker", aspects:['androphilic']},
  { name:"Cockgrinder", aspects:['androphilic','violent']},
  { name:"Cockhammer", aspects:['androphilic','violent']},
  { name:"Cockpounder", aspects:['androphilic','violent']},
  { name:"Cockslapper", aspects:['androphilic','violent','dominant']},
  { name:"Cockslobber", aspects:['androphilic','cum-lover']},
  { name:"Cockstabber", aspects:['androphilic','violent']},
  { name:"Crackhead", aspects:['violent']},
  { name:"Cumdrinker", aspects:['androphilic','cum-lover.3']},
  { name:"Cumdripper", triggers:['big-balls'], restriction:'has-cock'},
  { name:"Cumdumpster", aspects:['androphilic','cum-lover.3']},
  { name:"Cumfarts", aspects:['androphilic','cum-lover','anal-slut']},
  { name:"Cumriver", triggers:['monster-balls'], restriction:'has-cock'},
  { name:"Cumshitter", aspects:['androphilic','cum-lover.3','ass-obsessed.3','revolting']},
  { name:"Cumtoilet", aspects:['androphilic','cum-lover.3','golden.2']},
  { name:"Cuntdestroyer", aspects:['gynephilic','pussy-lover.2','stretcher.2','violent'], triggers:['monster-cock'], restriction:'has-cock'},
  { name:"Cuntfister", aspects:['gynephilic','stretcher.3']},
  { name:"Cuntfucker", aspects:['gynephilic']},
  { name:"Cuntkicker", aspects:['gynephilic','violent']},
  { name:"Cuntpounder", aspects:['gynephilic']},
  { name:"Cuntslapper", aspects:['gynephilic','violent']},
  { name:"Cuntslobber", aspects:['gynephilic']},
  { name:"Cuntspanker", aspects:['gynephilic','violent']},
  { name:"Cursecock", triggers:['monster-cock'], restriction:'has-cock'},
  { name:"Deathdigger", aspects:['violent']},
  { name:"Deathfucker", aspects:['violent']},
  { name:"Deathkiller", aspects:['violent']},
  { name:"Deathshitter", aspects:['violent','revolting']},
  { name:"Dickbiter", aspects:['androphilic','cum-lover','violent']},
  { name:"Dickfister", aspects:['androphilic','stretcher.2']},
  { name:"Dickfucker", aspects:['androphilic']},
  { name:"Dicknipples", triggers:['dick-nipples']},
  { name:"Dickshitter", aspects:['androphilic','revolting']},
  { name:"Dickslapper", aspects:['androphilic','violent']},
  { name:"Dies Horribly", triggers:['stupid','magical']},
  { name:"Dogfister", aspects:['beast-lover','stretcher.2']},
  { name:"Dogfucker", aspects:['beast-lover.2']},
  { name:"Dogshits", aspects:['beast-lover','revolting']},
  { name:"Dogthrower", aspects:['beast-lover','violent']},
  { name:"Donkeyfister", aspects:['beast-lover','stretcher.2']},
  { name:"Donkeyfucker", aspects:['beast-lover.2']},
  { name:"Donkeypunch", aspects:['beast-lover','violent']},
  { name:"Donkeyshits", aspects:['beast-lover','revolting']},
  { name:"Doombringer", aspects:['violent']},
  { name:"Doomfister", aspects:['violent','stretcher.2']},
  { name:"Doomfucker", aspects:['violent']},
  { name:"Doomhammer", aspects:['violent']},
  { name:"Doomshitter", aspects:['violent','revolting']},
  { name:"Emergency" },
  { name:"Fatcock", triggers:['big-cock'], restriction:'has-cock'},
  { name:"Fatcocks", triggers:['big-cock','multi-cock'], restriction:'has-cock'},
  { name:"Flavored" },
  { name:"Fuckass", aspects:['ass-obsessed.3']},
  { name:"Fuckfucker" },
  { name:"Fuckitall" },
  { name:"Fuckkiller", aspects:['violent']},
  { name:"Fustylugs", triggers:['ugly']},
  { name:"Gangbanger", aspects:['orgy-lover.2'] },
  { name:"Gloryhole", aspects:['androphilic','cum-lover.3']},
  { name:"Gobshite", aspects:['revolting']},
  { name:"Gubblesmucks", triggers:['ugly']},
  { name:"Hatecopter", aspects:['violent']},
  { name:"Helldozer", aspects:['violent']},
  { name:"Hellhammer", aspects:['violent']},
  { name:"Horsecock", triggers:['horse-cock'], restriction:'has-cock'},
  { name:"Horsecocks", triggers:['horse-cock','multi-cock'], restriction:'has-cock'},
  { name:"Horsefister", aspects:['beast-lover.2','stretcher.2']},
  { name:"Horsefucker", aspects:['beast-lover.3']},
  { name:"Horsepisser", aspects:['golden.2']},
  { name:"Horseshits", aspects:['beast-lover','revolting']},
  { name:"Goatshits", aspects:['beast-lover','revolting']},
  { name:"Goatfucker", aspects:['beast-lover.3']},
  { name:"Goatfister", aspects:['beast-lover.2','stretcher.2']},
  { name:"Horseshits", aspects:['beast-lover.2','revolting']},
  { name:"Killfucker", aspects:['violent']},
  { name:"Knobpolish", aspects:['androphilic']},
  { name:"Manglefucker", aspects:['violent']},
  { name:"Manglestabber", aspects:['violent']},
  { name:"Pissdrinker", aspects:['golden.2']},
  { name:"Pissfarts", aspects:['anal-slut','golden']},
  { name:"Motherfister", aspects:['stretcher.3']},
  { name:"Motherfucker" },
  { name:"Murderface", aspects:['violent']},
  { name:"Nickelback" },
  { name:"Nipplebitter", aspects:['gynephilic','violent','tit-lover']},
  { name:"Nipplefucker", aspects:['gynephilic','stretcher','tit-lover']},
  { name:"Nippleyanks", aspects:['gynephilic','violent','tit-lover']},
  { name:"Rateater" },
  { name:"Ratfister", aspects:['beast-lover','stretcher']},
  { name:"Ratfucker", aspects:['beast-lover.2']},
  { name:"Ratkicker", aspects:['beast-lover','violent']},
  { name:"Ratkiller", aspects:['beast-lover','violent']},
  { name:"Ratpounder", aspects:['beast-lover.2']},
  { name:"Ratstabber", aspects:['beast-lover','violent']},
  { name:"Rattosser", aspects:['beast-lover']},
  { name:"Sex Machine", aspects:['pussy-lover.3','ass-obsessed.3']},
  { name:"Shitbucket", aspects:['revolting']},
  { name:"Shitfister", aspects:['stretcher.3','revolting']},
  { name:"Shitfucker", aspects:['revolting']},
  { name:"Shitgrinder", aspects:['violent','revolting']},
  { name:"Shithammer", aspects:['violent','revolting']},
  { name:"Shitkicker", aspects:['violent','revolting']},
  { name:"Shitpounder", aspects:['violent','revolting']},
  { name:"Shitshitter", aspects:['revolting']},
  { name:"Shitsniffer", aspects:['revolting']},
  { name:"Shitthrower", aspects:['violent','revolting']},
  { name:"Shittingdicknipples", aspects:['revolting'], triggers:['dick-nipples'], restriction:'has-pussy'},
  { name:"Shittingnipplecunts", aspects:['revolting'], triggers:['nipple-cunts'], restriction:'has-pussy'},
  { name:"Snotlicker", aspects:['violent']},
  { name:"the Bloodsoaked", aspects:['violent']},
  { name:"the Fucking Shit", triggers:['smart','beautiful','magical']},
  { name:"the Horsefucked", aspects:['beast-lover']},
  { name:"the Pussyhammer", aspects:['gynephilic']},
  { name:"the Shit", triggers:['smart','beautiful']},
  { name:"the Tosser", aspects:['violent']},
  { name:"Threecocks", triggers:['multi-cock','multi-cock'], restriction:'has-cock'},
  { name:"Throatfister", aspects:['stretcher.2']},
  { name:"Throatfucker" },
  { name:"Throatstabber", aspects:['violent']},
  { name:"Titfucker", aspects:['gynephilic','tit-lover']},
  { name:"Titgrinder", aspects:['gynephilic','tit-lover','violent']},
  { name:"Titpounder", aspects:['gynephilic','tit-lover','violent']},
  { name:"Titpuncher", aspects:['gynephilic','tit-lover','violent']},
  { name:"Titslapper", aspects:['gynephilic','tit-lover','violent']},
  { name:"Titspanker", aspects:['gynephilic','tit-lover','violent']},
  { name:"Titstabber", aspects:['gynephilic','tit-lover','violent']},
  { name:"Titwhipper", aspects:['gynephilic','tit-lover','violent']},
  { name:"Twatbanger", aspects:['gynephilic']},
  { name:"Twatfister", aspects:['gynephilic','stretcher.2']},
  { name:"Twatfucker", aspects:['gynephilic']},
  { name:"Twatgrinder", aspects:['gynephilic','violent']},
  { name:"Twathammer", aspects:['gynephilic','violent']},
  { name:"Twatpounder", aspects:['gynephilic','violent']},
  { name:"Twatslapper", aspects:['gynephilic','violent']},
  { name:"Twatwhipper", aspects:['gynephilic','violent']},
  { name:"Weaseleater", aspects:['beast-lover','violent']},
  { name:"Weaselfister", aspects:['beast-lover','stretcher']},
  { name:"Weaselfucker", aspects:['beast-lover.2']},
  { name:"Weaselpounder", aspects:['beast-lover','violent']},
  { name:"Weaseltosser", aspects:['beast-lover','violent']},
  { name:"Weaseltrainer", aspects:['beast-lover']},
];

names.forEach(name => {
  NameBuilder.addName(name, 'GoblinLast');
});
