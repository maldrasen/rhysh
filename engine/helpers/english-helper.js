global.EnglishHelper = {

  // Prepends an a/an to the beginning of the string if it starts with a vowel.
  a_an(string) {
    return string.match(/^[aeiou]/i) ? `an ${string}` : `a ${string}`;
  },

  possessive(name) {
    return (name.match(/(.)$/)[1] == 's') ? `${name}'` : `${name}'s`;
  },

  // Prepends an A/An to the beginning of the string if it starts with a vowel.
  A_An(string) {
    return string.match(/^[aeiou]/i) ? `An ${string}` : `A ${string}`;
  },

  // For phrases where there you might be acting on 'both things', or on 'all things'
  all_both(number) {
    if (number <= 1) { return Weaver.error(`English.all_both(${number}) must be greater than 1`); }
    return (number > 2) ? 'both' : 'all';
  },

  // Returns a positive number in English. If a 'whenOne' option is specified
  // then that is returned for 'one' in cases where "a" or "an" would sound
  // better in a phrase, i.e. 'a big black cock' is better than 'one big black
  // cock'. The whenZero options is the same, but for zero.
  numberInEnglish(number, options={}) {
    const oneWords = ['', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine'];
    const tenWords = ['', '', 'twenty', 'thirty', 'forty', 'fifty', 'sixty', 'seventy', 'eighty', 'ninety'];
    const teenWords = ['ten', 'eleven', 'twelve', 'thirteen', 'fourteen', 'fifteen', 'sixteen', 'seventeen', 'eighteen', 'nineteen'];

    let millions = function(n) {
      return (n >= 1000000) ?
        `${millions(Math.floor(n/1000000))} million ${thousands(n%1000000)}`:
        `${thousands(n)}`;
    }

    let thousands = function(n) {
      return (n >= 1000) ?
        `${hundreds(Math.floor(n/1000))} thousand ${hundreds(n%1000)}`:
        `${hundreds(n)}`
    }

    let hundreds = function(n) {
      return (n >= 100) ?
        `${oneWords[Math.floor(n/100)]} hundred ${tens(n%100)}`:
        `${tens(n)}`
    }

    let tens = function(n) {
      if (n < 10) { return oneWords[n]; }
      if (n >= 10 && n < 20) { return teenWords[n-10]; }
      if (n % 10 == 0) { return tenWords[Math.floor(n/10)]; }
      return `${tenWords[Math.floor(n/10)]}-${oneWords[n%10]}`;
    }

    if (number < 0)  { throw `Error: Not doing negative numbers in English: ${number}`; }
    if (number == 0) { return options.whenZero || 'zero'; }
    if (number == 1) { return options.whenOne || 'one'; }

    return millions(number);
  },

  // Same as numberInEnglish(), but upper case.
  NumberInEnglish(number, options) {
    return TextHelper.titlecase(EnglishHelper.numberInEnglish(number, options));
  },

  // This function should already get a converted length, a number either in
  // inches or centimeters. This function just puts the converted number into
  // a short English phrase.
  lengthInEnglish(value, plural) {
    return Settings.metric() ?
      EnglishHelper.centimetersInEnglish(value, plural):
      EnglishHelper.inchesInEnglish(value, plural);
  },

  // The plural or non-plural versions of centimetersInEngligh() will produce
  // phrases for use in sentances like:
  //    His cock is thirty-four centimeters long.
  //    His twenty-eight centimeter long cock.
  //
  centimetersInEnglish(value, plural) {
    if (value == 1) { return 'one centimeter'; }
    return `${EnglishHelper.numberInEnglish(value)} centimeter${plural ? 's' : ''}`
  },

  // This is a rather ugly and complex function that takes a measurement and
  // returns a phrase describing that measurement in inches or feet.
  //
  //   Number: The number in inches
  //   Plural: Use feet and inches, or foot and inch.
  //
  // This is used mostly by the CockDescriber, but I could see it being used
  // elsewhere too. The measurements are good up until about three feet in
  // length. At that point the function only returns the number of inches
  // it's given.

  inchesInEnglish(value, plural) {
    let number = Math.floor(value);
    let englighNumber = EnglishHelper.numberInEnglish(number)
    let part = Math.floor((value-number)*10)
    let a = plural ? '' : 'a ';
    let inch = (plural && number != 1) ? 'inches' : 'inch'
    let foot = (plural && number != 12) ? 'feet' : 'foot'

    if(part > 6 && inch == 'inch' && plural) { inch = 'inches'; }

    if (number == 0) {
      if (part > 6) { return 'nearly inch'; }
      if (part > 4) { return `${a}half an inch`; }
      if (part > 1) { return `${a}quarter of an inch`; }
      return `${a}fraction of an inch`;
    }
    if (number < 6) {
      if (part > 6) { return `${englighNumber} and three quarter ${inch}`; }
      if (part > 4) { return `${englighNumber} and a half ${inch}`; }
      if (part > 1) { return `${englighNumber} and a quarter ${inch}`; }
      return `${englighNumber} ${inch}`;
    }
    if (number < 12) {
      if (part > 4) { return `${englighNumber} and a half ${inch}`; }
      return `${englighNumber} ${inch}`;
    }
    if (number < 18) {
      if (part > 4) { return `${englighNumber} and a half ${inch}`; }
      return `${englighNumber} ${inch}`;
    }
    if (number == 18) {
      return Random.from([`eighteen ${inch}`,'a foot and a half']);
    }
    if (21 <= number && number < 24) {
      return `${englighNumber} ${inch}`;
    }
    if (number == 24) {
      return Random.from([`${englighNumber} ${inch}`, `two ${foot}`]);
    }
    if (29 <= number && number <= 31) {
      return Random.from([`${englighNumber} ${inch}`, `two and a half ${foot}`]);
    }
    if (34 <= number && number <= 38) {
      return Random.from([`${englighNumber} ${inch}`, `three ${foot}`]);
    }
    return `${englighNumber} ${inch}`;
  },

  // Because you sometimes need to compare the size of round things to other
  // things that are round. Width is in mm
  roundWidthComparator(width) {
    if (width < 5)   { return Random.from(['pea', 'peanut', 'pearl', 'bean']); }
    if (width < 13)  { return Random.from(['olive', 'acorn', 'cherry', 'grape', 'marble', 'cranberry', 'hazelnut']); }
    if (width < 26)  { return Random.from(['walnut', 'cherry tomato', 'brazil nut']); }
    if (width < 38)  { return Random.from(['strawberry', 'chicken egg']); }
    if (width < 52)  { return Random.from(['avacado','lemon', 'lime', 'tomato']); }
    if (width < 64)  { return Random.from(['plum','tomato','peach']); }
    if (width < 76)  { return Random.from(['baseball', 'fist', 'tomato']); }
    if (width < 89)  { return Random.from(['peach', 'lemon', 'fist', 'doorknob']); }
    if (width < 102) { return Random.from(['softball','apple','fist', 'potato']); }
    if (width < 127) { return Random.from(['orange', 'apple', 'onion']); }
    if (width < 152) { return Random.from(['onion', 'apple', 'bell pepper']); }
    if (width < 178) { return Random.from(['mango', 'onion', 'grapefruit', 'sweet potato','ostrich egg']); }
    if (width < 203) { return Random.from(['grapefruit', 'football', 'sweet potato']); }
    if (width < 229) { return Random.from(['volleyball', 'bowling ball', 'soccer ball']); }
    if (width < 254) { return Random.from(['basketball', 'cabbage', 'melon', 'eggplant']); }
    if (width < 305) { return Random.from(['cantaloupe', 'melon', 'coconut', 'squash', 'milk jug']); }
    if (width < 381) { return Random.from(['head of lettuce', 'coconut', 'decorative gourd']); }
    if (width < 457) { return Random.from(['pineapple', 'coconut', 'honeydew melon']); }
    if (width < 559) { return Random.from(['watermelon','pumpkin']); }
    if (width < 762) { return Random.from(['pumpkin','jackfruit']); }
    return Random.from(['beach ball']);
  },

  // Because you sometimes need to compare the size of round things... in plural!
  // I wish I could think of a better way to do this rather than just copying and
  // editing the list, but plurals like "heads of lettuce" make it tricky.
  pluralRoundWidthComparator(width) {
    if (width < 5)   { return Random.from(['peas', 'peanuts', 'pearls', 'beans']); }
    if (width < 13)  { return Random.from(['olives', 'acorns', 'cherries', 'grapes', 'marbles', 'cranberries', 'hazelnuts']); }
    if (width < 26)  { return Random.from(['walnuts', 'cherry tomatoes', 'brazil nuts']); }
    if (width < 38)  { return Random.from(['strawberries', 'chicken eggs']); }
    if (width < 52)  { return Random.from(['avacados', 'lemons', 'limes', 'tomatoes']); }
    if (width < 64)  { return Random.from(['plums', 'tomatoes','peaches']); }
    if (width < 76)  { return Random.from(['baseballs', 'fists', 'tomatos']); }
    if (width < 89)  { return Random.from(['peaches', 'lemons', 'fists', 'doorknobs']); }
    if (width < 102) { return Random.from(['softballs','apples','fists', 'potatos']); }
    if (width < 127) { return Random.from(['oranges', 'apples', 'onions']); }
    if (width < 152) { return Random.from(['onions', 'apples', 'bell peppers']); }
    if (width < 178) { return Random.from(['mangos', 'onions', 'grapefruits', 'sweet potatoes','ostrich eggs']); }
    if (width < 203) { return Random.from(['grapefruits', 'footballs', 'sweet potatos']); }
    if (width < 229) { return Random.from(['volleyballs', 'bowling balls', 'soccer balls']); }
    if (width < 254) { return Random.from(['basketballs', 'cabbages', 'melons', 'eggplants']); }
    if (width < 305) { return Random.from(['cantaloupes', 'melons', 'coconuts', 'squashs', 'milk jugs']); }
    if (width < 381) { return Random.from(['heads of lettuce', 'coconuts', 'decorative gourds']); }
    if (width < 457) { return Random.from(['pineapples', 'coconuts', 'honeydew melons']); }
    if (width < 559) { return Random.from(['watermelons','pumpkins']); }
    if (width < 762) { return Random.from(['pumpkins','jackfruits']); }
    return Random.from(['beach balls']);
  },

}
