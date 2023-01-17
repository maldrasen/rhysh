export default (function() {

  function load(element, templatePath) {
    ClientCommands.loadTemplate(templatePath).then(template => {
      element.setHTML(template);
    });
  }

  return {
    load: load
  };

})();