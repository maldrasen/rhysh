global.Lister = (function() {

  // Take a list of objects and turn them into a single phrase that includes
  // all of the objects and their quantities. Object list should be in the
  // following form:
  //    [{ word:'word', words:'wordz', count:X }...]
  //
  // Words is optional, but should be used to specify a plural of a word that
  // doesn't follow normal pluralization rules.
  return (list) => {
    if (list.length == 0) { return ""; }
    if (list.length == 1) { return oneWord(list); }
    if (list.length == 2) { return twoWords(list); }
    if (list.length >= 3) { return threeWords(list); }
  };

  function enplural(word) {
    return (word.match(/s$/) ? `${word}es` : `${word}s`)
  }

  function oneWord(list) {
    const word = list[0].word;
    const words = list[0].words || enplural(word);
    const count = list[0].count;
    const number = EnglishHelper.numberInEnglish(count)

    if (count == 1) { return `a single ${word}`; }
    if (count == 2) { return Random.from([`a pair of ${words}`,`a couple of ${words}`]); }
    if (count >= 3) { return `${number} ${words}`; }
  }

  function twoWords(list) {
    const count_1 = list[0].count;
    const count_2 = list[1].count;
    const word_1 =  list[0].word;
    const word_2 =  list[1].word;
    const words_1 = list[0].words || enplural(word_1);
    const words_2 = list[1].words || enplural(word_2);
    const a_word_1 = EnglishHelper.a_an(word_1);
    const a_word_2 = EnglishHelper.a_an(word_2);
    const number_1 = EnglishHelper.numberInEnglish(count_1)
    const number_2 = EnglishHelper.numberInEnglish(count_2)

    if (count_1 == 1 && count_2 == 1) { return `${a_word_1} and ${a_word_2}`; }

    if (count_1 == 1 && count_2 == 2) {
      return Random.from([
        `${a_word_1} and a pair of ${words_2}`,
        `${a_word_1} and a couple of ${words_2}`,
      ]);
    }

    if (count_1 == 2 && count_2 == 1) {
      return Random.from([
        `${a_word_2} and a pair of ${words_1}`,
        `${a_word_2} and a couple of ${words_1}`,
      ]);
    }

    if (count_1 == 2 && count_2 == 2) {
      return Random.from([
        `a couple of ${words_1} and ${words_2}`,
        `two ${words_1} and two ${words_2}`
      ]);
    }

    if (count_1 == 1 && count_2 >= 3) { return `${number_2} ${words_2} and a single ${word_1}`; }
    if (count_1 >= 3 && count_2 == 1) { return `${number_1} ${words_1} and a single ${word_2}`; }
    if (count_1 >= 2 && count_2 >= 2) { return `${number_1} ${words_1} and ${number_2} ${words_2}`; }
  }

  function threeWords(list) {
    let phrase = "";

    for (i=0; i<list.length; i++) {
      if (i == list.length - 1) { phrase += ", and "; }
      else if (i >= 1) { phrase += ", "; }
      phrase += (i < list.length - 1 && list[i].count == 1) ?
        EnglishHelper.a_an(list[i].word):
        oneWord([list[i]]);
    }

    return phrase;
  }

})();
