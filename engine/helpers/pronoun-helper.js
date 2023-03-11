global.PronounHelper = (function() {

  function his(sex)  { return { female:'her',  futa:'hir',  male:'his' }[configuredSex(sex)]; }
  function him(sex)  { return { female:'her',  futa:'hir',  male:'him' }[configuredSex(sex)]; }
  function he(sex)   { return { female:'she',  futa:'shi',  male:'he'  }[configuredSex(sex)]; }
  function hers(sex) { return { female:'hers', futa:'hirs', male:'his' }[configuredSex(sex)]; }

  function His(sex) { return TextHelper.titlecase(his(sex)); }
  function Him(sex) { return TextHelper.titlecase(him(sex)); }
  function He(sex) { return TextHelper.titlecase(he(sex)); }
  function Hers(sex) { return TextHelper.titlecase(hers(sex)); }

  function configuredSex(sex) {
    return (sex == 'futa' && Settings.getFutaPronouns() == 'she') ? 'female' : sex;
  }

  return {
    his, him, he, hers,
    His, Him, He, Hers,
  };

})();
