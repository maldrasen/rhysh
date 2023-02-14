// <div class='scrolling-panel-frame'>
//   <div class='scrolling-panel' style='height=200px'>
//     <div class='scrolling-panel-content'>
//
// <div class='fixedContent'>
//   <div class='scrolling-panel track-parent'>
//     <div class='scrolling-panel-content'>
//
window.ScrollingPanel = (function() {
  const stepDistance = 50;
  let activeGrab = null;

  // Keycodes for scrolling panel movement
  //   33 - Page Up
  //   34 - Page Down
  //   35 - End
  //   36 - Home
  //   38 - Up Arrow
  //   40 - Down Arrow
  //
  function init() {

    window.addEventListener('mousedown', event => {
      if (event.target.matches('.scrolling-panel-track')) { trackClicked(event); }
    });

    window.addEventListener('mousedown', event => {
      if (event.target.matches('.scrolling-panel-thumbwheel')) { startDrag(event); }
    });

    window.addEventListener('keydown', event => {
      visibleScrollPanels().forEach(scrollingPanel => {
        if ([33,34,35,36,38,40].indexOf(event.keyCode) >= 0) {
          event.preventDefault();
          event.stopPropagation();

          if (event.keyCode == 33) { stepUp(scrollingPanel, stepDistance); }
          if (event.keyCode == 34) { stepDown(scrollingPanel, stepDistance); }
          if (event.keyCode == 35) { scrollToBottom(scrollingPanel); }
          if (event.keyCode == 36) { scrollToTop(scrollingPanel); }
          if (event.keyCode == 38) { stepUp(scrollingPanel, stepDistance/5); }
          if (event.keyCode == 40) { stepDown(scrollingPanel, stepDistance/5); }
        }
      });
    });

    // Trigger Resize when window is resized. (Container height may change.)
    window.addEventListener('resize', resizeAll);
  }

  function visibleScrollPanels() {
    let panels = [];
    X.each('.scrolling-panel', panel => {
      if (panel.offsetWidth > 0 && panel.offsetHeight > 0) {
        panels.push(panel);
      }
    });
    return panels;
  }

  // Build the scrolling panel. This only needs to be called once for each
  // panel. The argument can either be a query selector to the element or the
  // scrolling panel element itself.
  function build(arg) {
    let result = findScrollingPanel(arg);
    let scrollingPanel = result.scrollingPanel;
    let contentPanel = result.contentPanel;

    // Only build scrolling panels once.
    if (scrollingPanel.querySelector('.scrolling-panel-track')) { return; }

    // If this panel should track its parent for its height, and there is no
    // ancestor with the scrolling-panel-parent class, then assume the
    // immediate parent is the height source.
    if (X.hasClass(scrollingPanel,'track-parent')) {
      if (scrollingPanel.closest('.scrolling-panel-parent') == null) {
        X.addClass(scrollingPanel.parentElement,'scrolling-panel-parent');
      }
    }

    scrollingPanel.addEventListener('wheel', event => {
      event.preventDefault();
      event.stopPropagation();

      (event.deltaY > 0) ?
        stepDown(scrollingPanel, stepDistance):
        stepUp(scrollingPanel, stepDistance);
    });

    let track = X.createElement(`
      <div class='scrolling-panel-track'>
        <div class='scrolling-panel-thumbwheel'></div>
      </div>
    `);

    scrollingPanel.appendChild(track);
    scrollingPanel.setAttribute('data-scroll-position',0);
    scrollingPanel.setAttribute('data-thumb-position',0);

    resize(scrollingPanel);
  }

  // Find the scrolling panel element given either an element or a query
  // selector to the element or an element that has a scrolling panel as a
  // decendent.
  function findScrollingPanel(arg) {
    let scrollingPanel = arg;

    if (typeof arg == 'string') {
      scrollingPanel = document.querySelector(`${arg} .scrolling-panel`) ||
                       document.querySelector(arg);
    }

    if (scrollingPanel == null || X.hasClass(scrollingPanel,'scrolling-panel') == false) {
      throw `Cannot find .scrolling-panel within ${arg}`;
    }

    let contentPanel = scrollingPanel.querySelector('.scrolling-panel-content');
    if (contentPanel == null) {
      throw "Scrolling panel must contain a .scrolling-panel-content";
    }

    return { scrollingPanel, contentPanel };
  }

  function resize(arg) {
    let result = findScrollingPanel(arg);
    let scrollingPanel = result.scrollingPanel;
    let contentPanel = result.contentPanel;

    if (scrollingPanel.clientHeight == 0) { return; }

    let track = scrollingPanel.querySelector('.scrolling-panel-track');
    let thumbwheel = scrollingPanel.querySelector('.scrolling-panel-thumbwheel');

    let contentHeight = contentPanel.scrollHeight;
    let visibleHeight = getVisibleHeight(scrollingPanel);

    if (visibleHeight >= contentHeight) {
      setThumbPosition(scrollingPanel, 0);
      X.addClass(track,'off');
      return
    }

    X.removeClass(track,'off');

    let thumbHeight = (visibleHeight / contentHeight) * visibleHeight;
    if (thumbHeight < 50) {
      thumbHeight = 50;
    }

    let thumbExtent = visibleHeight - thumbHeight;
    let thumbPosition = scrollingPanel.getAttribute('data-scroll-position') * thumbExtent;
    let stepExtent = (stepDistance / contentHeight) * visibleHeight;

    setThumbPosition(scrollingPanel, thumbPosition);
    setThumbExtent(scrollingPanel, thumbExtent);

    thumbwheel.style['height'] = `${thumbHeight}px`;
  }

  function resizeAll() {
    X.each('.scrolling-panel', scrollingPanel => resize(scrollingPanel));
  }

  // If the contents of the scrolling panel are likely to change call observe()
  // to automatically call resize() when the content panel is resized.
  function observe(scrollingPanel) {
    var content = scrollingPanel.querySelector('.scrolling-panel-content');

    var observer = new MutationObserver(function(mutations) {
      resize(scrollingPanel);
    });

    observer.observe(content, {
      childList: true,
      subtree: true,
      attributes: false,
      characterData: false
    });
  }

  function getThumbExtent(scrollingPanel) {
    return parseInt(scrollingPanel.getAttribute('data-thumb-extent') || 1);
  }

  function getThumbPosition(scrollingPanel) {
    return parseInt(scrollingPanel.getAttribute('data-thumb-position') || 0);
  }

  function setThumbExtent(scrollingPanel,extent) {
    scrollingPanel.setAttribute('data-thumb-extent', extent);
  }

  function setThumbPosition(scrollingPanel, position) {
    if (typeof position == 'string') {
      position = parseInt(position);
    }

    scrollingPanel.setAttribute('data-thumb-position', position);
    scrollingPanel.querySelector('.scrolling-panel-thumbwheel').style['top'] = `${position}px`;

    positionView(scrollingPanel);
  }

  // Read the thumb-position and set view offset
  function positionView(scrollingPanel) {
    let content = scrollingPanel.querySelector('.scrolling-panel-content');
    let thumbExtent = getThumbExtent(scrollingPanel);
    let thumbPosition = getThumbPosition(scrollingPanel);
    let scrollPosition = 1 - ((thumbExtent - thumbPosition) / thumbExtent);
    let contentOffset = 0;

    if (scrollPosition > 1) {
      scrollPosition = 1;
    }

    scrollingPanel.setAttribute('data-scroll-position', scrollPosition);

    if (scrollPosition > 0) {
      let contentHeight = content.scrollHeight;
      let visibleHeight = getVisibleHeight(scrollingPanel);
      contentOffset = (contentHeight - visibleHeight) * -scrollPosition
    }

    content.style['top'] = `${contentOffset}px`;
  }

  function stepDown(scrollingPanel, step) {
    if (isActive(scrollingPanel) == false) { return false; }

    let extent = getThumbExtent(scrollingPanel);
    let position = getThumbPosition(scrollingPanel) + step;
    if (position > extent) {
      position = extent;
    }

    setThumbPosition(scrollingPanel, position);
  }

  function stepUp(scrollingPanel, step) {
    if (isActive(scrollingPanel) == false) { return false; }

    var position = getThumbPosition(scrollingPanel) - step;
    if (position < 0) {
      position = 0;
    }

    setThumbPosition(scrollingPanel, position);
  }

  function scrollToTop(scrollingPanel) {
    if (isActive(scrollingPanel)) {
      setThumbPosition(scrollingPanel, 0);
    }
  }

  function scrollToBottom(scrollingPanel) {
    if (isActive(scrollingPanel)) {
      setThumbPosition(scrollingPanel, getThumbExtent(scrollingPanel));
    }
  }

  function trackClicked(event) {
    let scrollingPanel = event.target.closest('.scrolling-panel');
    let thumb = scrollingPanel.querySelector('.scrolling-panel-thumbwheel');

    let clickAt = event.pageY;
    let thumbPosition = X.getPosition(thumb).top;
    let thumbHeight = thumb.clientHeight;

    if (clickAt < thumbPosition) {
      stepUp(scrollingPanel, thumbHeight);
    }

    if (clickAt > (thumbPosition + thumbHeight)) {
      stepDown(scrollingPanel, thumbHeight);
    }
  }

  function startDrag(event) {
    let body = X.first('body');
    let scrollingPanel = event.target.closest('.scrolling-panel');
    let scrollTop = body.scrollTop;

    activeGrab = {
      scrollingPanel: scrollingPanel,
      position: (event.pageY - X.getPosition(event.target).top + scrollTop)
    };

    body.addEventListener('mousemove', moveThumb);
    body.addEventListener('mouseup', stopDrag);
    body.addEventListener('mouseleave', stopDrag);
  }

  function stopDrag(event) {
    let body = X.first('body');

    body.removeEventListener('mousemove', moveThumb);
    body.removeEventListener('mouseup', stopDrag);
    body.removeEventListener('mouseleave', stopDrag);

    activeGrab = null;
  }

  function moveThumb(event) {
    let panelTop = X.getPosition(activeGrab.scrollingPanel).top;
    let scrollTop = X.first('body').scrollTop;
    let top = event.pageY - activeGrab.position - panelTop + scrollTop;
    let limit = getThumbExtent(activeGrab.scrollingPanel);

    if (top < 0) { top = 0; }
    if (top > limit) { top = limit; }

    setThumbPosition(activeGrab.scrollingPanel, top);
  }

  function getVisibleHeight(scrollingPanel) {
    return X.hasClass(scrollingPanel,'track-parent') ?
      scrollingPanel.closest('.scrolling-panel-parent').clientHeight:
      scrollingPanel.clientHeight;
  }

  function isActive(scrollingPanel) {
    return X.hasClass(scrollingPanel.querySelector('.scrolling-panel-track'), 'off') == false
  }

  return {
    init,
    build,
    resize,
    resizeAll,
    observe,
    scrollToTop,
    scrollToBottom,
  };

})();
