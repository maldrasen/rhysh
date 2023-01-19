window.Template = (function() {

  function load(selector, templatePath) {
    return new Promise(resolve => {
      ClientCommands.loadTemplate(templatePath).then(template => {
        X.first(selector).setHTML(template);
        resolve();
      });
    });
  }

  return {
    load: load
  };

})();
