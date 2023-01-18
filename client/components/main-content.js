export default (function() {

  let currentStage;
  let tween;

  // Wire the global event listeners.
  const init = function() {
    X.onClick('a.send-command', handleSendCommend);
  }

  // Views that can be used as stages will have a name and a show() function.
  const setStage = function(view) {
    currentStage = view.name;
    showCover();
    view.show();
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

  // Called after the template has been loaded. We remove all the debug elements in every template if there are any,
  // but there might be other global template tasks at some point.
  const ready = function() {
    if (Environment.debug == false) {
      X.remove('.show-when-dev');
    }
  }

  const showCover = function() {
    X.first('#mainCover').removeAttribute('class');
  }

  // Elements can jump around and shuffle a bit when we change stages, so to cover that up we fade in the view when
  // the stage changes. For some stage transitions we may want to disable this though, in which case I'll add a
  // property to just skip to the onComplete()
  const hideCover = function(properties = {}) {
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
    init: init,
    ready: ready,
    setStage: setStage,
    showCover: showCover,
    hideCover: hideCover,
    show: show,
  };

})();
