global.PronounHelper = (function() {

  function his(sex)  { return { female:'her',  futa:'hir',  male:'his' }[sex]; }
  function him(sex)  { return { female:'her',  futa:'hir',  male:'him' }[sex]; }
  function he(sex)   { return { female:'she',  futa:'shi',  male:'he' }[sex]; }
  function hers(sex) { return { female:'hers', futa:'hirs', male:'his' }[sex]; }

  function His(sex) { return TextHelper.titlecase(his(sex)); }
  function Him(sex) { return TextHelper.titlecase(him(sex)); }
  function He(sex) { return TextHelper.titlecase(he(sex)); }
  function Hers(sex) { return TextHelper.titlecase(hers(sex)); }

  return {
    his, him, he, hers,
    His, Him, He, Hers,
  };

})();
