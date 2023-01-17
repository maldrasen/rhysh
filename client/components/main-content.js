export default (function() {

  const init = function() {
    X.onClick('a.send-command', handleSendCommend);
  }

  // The chrome sanitizer strips out data attributes when using the setHTML() function so I'm stuck sticking the
  // command names into the HREF as anchors. I suppose they're technically like HREFs anyway. I may also need to
  // include arguments along with these commands though, including them inside of the href and parsing them out. A
  // comma seperated list should work well enough though.
  const handleSendCommend = function(event) {
    const href = event.target.getAttribute('href');
    const command = href.substring(1, href.length);
    ClientCommands.send(command);
  }

  const ready = function() {
    if (Environment.debug == false) {
      X.remove('.show-when-dev');
    }
  }

  // The main content screnes should all be loaded in a pretty similar way. We fetch an HTML template from the server,
  // replace the contents of main content with it.
  const show = function(options) {
    return new Promise(resolve => {
      Template.load('#mainContent', options.path).then(() => {
        BackgroundImage.setBackground(options.background);

        ready();
        resolve();
      });
    });
  }

  return {
    init: init,
    ready: ready,
    show: show,
  };

})();
