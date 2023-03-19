global.PronounHelper = (function() {

  function his(sex)  { return { female:'her',  futa:'hir',   male:'his', nosex:'its' }[configuredSex(sex)]; }
  function him(sex)  { return { female:'her',  futa:'hir',   male:'him', nosex:'it'  }[configuredSex(sex)]; }
  function he(sex)   { return { female:'she',  futa:'shi',   male:'he',  nosex:'it'  }[configuredSex(sex)]; }
  function hers(sex) { return { female:'hers', futa:'hirs',  male:'his', nosex:'its' }[configuredSex(sex)]; }
  function man(sex)  { return { female:'woman',futa:'womin', male:'man', nosex:'[ERROR]' }[configuredSex(sex)]; }
  function boy(sex)  { return { female:'girl', futa:'gurl',  male:'boy', nosex:'[ERROR]' }[configuredSex(sex)]; }

  function His(sex) { return TextHelper.titlecase(his(sex)); }
  function Him(sex) { return TextHelper.titlecase(him(sex)); }
  function He(sex) { return TextHelper.titlecase(he(sex)); }
  function Hers(sex) { return TextHelper.titlecase(hers(sex)); }
  function Man(sex) { return TextHelper.titlecase(man(sex)); }
  function Boy(sex) { return TextHelper.titlecase(boy(sex)); }

  function configuredSex(sex) {
    return (sex == 'futa' && Settings.getFutaPronouns() == 'she') ? 'female' : sex;
  }

  return {
    his, him, he, hers,
    His, Him, He, Hers,
    man, boy, Man, Boy
  };

})();
