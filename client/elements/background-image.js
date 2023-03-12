window.BackgroundImage = (function() {

  let tween;

  // Currently, I expect that all the background images will be pngs, and they'll all be located in the
  // /assets/backgrounds directory. I'd rather not have to do some kind of complicated image library thing like last
  // time if that can be avoided.
  function setBackground(code) {
    if (code == null) {
      return removeBackground();
    }

    X.first('#backgroundImage').setAttribute("style",`background-image:url('../assets/backgrounds/${code}.jpg')`);
  }

  function setFilter(filter) {
    if (filter.effect == 'wakeUp') { return playWakeUp(); }
    console.log("TODO: Other Background Filters",filter);
  }

  function removeBackground() {
    X.first('#backgroundImage').removeAttribute("style");
  }

  function playWakeUp() {
    const background = X.first('#backgroundImage');
    const image = background.style['background-image'];

    const animate = () => {
      if (tween) {
        requestAnimationFrame(animate);
        TWEEN.update();
      }
    }

    tween = new TWEEN.Tween({ value:100 });
    tween.to({ value:0 }, 3000);
    tween.easing(TWEEN.Easing.Quadratic.Out)

    tween.onUpdate(t => {
      let blur = t.value / 2;
      let brightness = (100 - t.value)/100;
      background.style['filter'] = `blur(${blur}px) brightness(${brightness})`
    });

    tween.onComplete(()=>{
      tween = null;
      background.style['filter'] = null;
    });

    tween.start();
    animate();
  }

  return {
    setBackground,
    setFilter,
    removeBackground,
  }

})();
