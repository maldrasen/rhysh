window.MainContent = (function() {

  let currentStage;
  let tween;

  // Wire the global event listeners.
  function init() {
    X.onClick('a.send-command', handleSendCommend);
    X.onClick('a.clear-content', clear);
  }

  function clear() {
    showCover();
    X.first('#mainContent').setHTML("");
  }

  // Views that can be used as stages will have a name and a show() function.
  function setStage(view, options={}) {
    currentStage = view.name;
    showCover();
    view.show(options);
  }

  // The chrome sanitizer strips out data attributes when using the setHTML() function so I'm stuck sticking the
  // command names into the HREF as anchors. I suppose they're technically like HREFs anyway. A command can include
  // arguments by including them after the command name in a comma seperated list. To prevent double clicking we add
  // the 'working' class to the button. It doesn't change the button visibly, but prevents the associated event from
  // firing twice. The working flag needs to be cleared if the button should be usable again.
  function handleSendCommend(event) {
    if (X.hasClass(event.target, "working")) { return; }

    X.addClass(event.target, "working");

    let parameters = event.target.getAttribute('href').split(',');
    let command = parameters.shift();
        command = command.substring(1, command.length);

    ClientCommands.send(command,parameters);
  }

  // The main content screnes should all be loaded in a pretty similar way. We fetch an HTML template from the server,
  // replace the contents of main content with it.
  function show(options) {
    return new Promise(resolve => {
      Template.load('#mainContent', options.path).then(() => {
        BackgroundImage.setBackground(options.background);

        ready();
        resolve();
      });
    });
  }

  // Called after the template has been loaded. We remove all the debug elements in every template if there are any,
  // but there might be other global template tasks at some point.
  function ready() {
    if (Environment.debug == false) {
      X.remove('.show-when-dev');
    }
  }

  function showCover() {
    X.first('#mainCover').removeAttribute('class');
  }

  // Elements can jump around and shuffle a bit when we change stages, so to cover that up we fade in the view when
  // the stage changes. For some stage transitions we may want to disable this though, in which case I'll add a
  // property to just skip to the onComplete()
  function hideCover(properties = {}) {
    const cover = X.first('#mainCover');

    const animate = () => {
      if (tween) {
        requestAnimationFrame(animate);
        TWEEN.update();
      }
    }

    tween = new TWEEN.Tween({ opacity:1 });
    tween.to({ opacity:0 }, (properties.fadeTime || 500));
    tween.easing(TWEEN.Easing.Quadratic.Out)

    tween.onUpdate(t => {
      cover.setAttribute('style',`opacity:${t.opacity}`);
    });

    tween.onComplete(()=>{
      tween = null;
      cover.removeAttribute('style');
      cover.setAttribute('class','hide');
    });

    tween.start();
    animate();
  }

  return {
    init,
    ready,
    clear,
    setStage,
    showCover,
    hideCover,
    show,
  };

})();
