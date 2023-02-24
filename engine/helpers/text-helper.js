global.TextHelper = {

  titlecase(word) {
    return `${word.charAt(0).toUpperCase()}${word.substring(1)}`;
  },

  titlecaseAll(phrase) {
    return phrase.split(/\s/).map(word => { return TextUtility.titlecase(word) }).join(' ');
  },

  startsWith(string, part) {
    return (string == null) ? false : string.slice(0, part.length) == part;
  },

  formatNumber(number) {
    return `${Math.round(number*100) / 100}`
  },

}
