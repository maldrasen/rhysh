global.QuoteTransformer = (function() {

  // Transform all the quotes in the text by sorrounding them in a quote span
  // and replacing the dumb quotation marks with smart ones. Text that have
  // specified a speaker will get a speaker class as well.
  //
  // Options:
  //   speaker: [player, other, null]
  function run(text, options) {
    let transformingQuotes = true;
    while (transformingQuotes) {
      let match = text.match(/^(.*)"([^"]+)"(.*)$/);
      if (match == null) { transformingQuotes = false } else {
        text = transform(text, options, match);
      }
    }

    return text;
  }

  function transform(text, options, match) {
    let classname = 'quote'
    if (options.speaker == 'player') { classname = 'player-quote'; }
    if (options.speaker == 'other')  { classname = 'other-quote'; }

    return `${match[1]}<span class='${classname}'>“${match[2]}”</span>${match[3]}`
  }

  return { run }

})();
