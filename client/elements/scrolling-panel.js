// <div class='scrolling-panel-frame'>
//   <div class='scrolling-panel' style='height=200px'>
//     <div class='scrolling-panel-content'>
//
// <div class='fixedContent'>
//   <div class='scrolling-panel track-parent'>
//     <div class='scrolling-panel-content'>
//
window.ScrollingPanel = (function() {
  const stepDistance = 100;

  function init() {
    // $(document).on('click', '.scrolling-panel-track', trackScroll);
    // $(document).on('mousedown', '.scrolling-panel-thumbwheel', startDrag);

    // // 33 - Page Up
    // // 34 - Page Down
    // // 35 - End
    // // 36 - Home
    // // 38 - Up Arrow
    // // 40 - Down Arrow
    // $(document).on('keydown', '.scrolling-panel', function(e) {
    //   if (e.target && e.target.nodeName == 'TEXTAREA') { return; }

    //   var panel = $(Elements.elementAtMousePosition()).closest('.scrolling-panel');

    //   if (panel.length > 0 && [33,34,35,36,38,40].indexOf(e.keyCode) >= 0) {
    //     e.preventDefault();
    //     e.stopPropagation();

    //     if (e.keyCode == 33) { stepUp(panel, stepDistance); }
    //     if (e.keyCode == 34) { stepDown(panel, stepDistance); }
    //     if (e.keyCode == 35) { scrollToBottom(panel); }
    //     if (e.keyCode == 36) { scrollToTop(panel); }
    //     if (e.keyCode == 38) { stepUp(panel, stepDistance/10); }
    //     if (e.keyCode == 40) { stepDown(panel, stepDistance/10); }
    //   }
    // });

    // // Trigger Resize when window is resized. (Container height may change.)
    // $(window).on('resize', function(e) {
    //   $.each($('.scrolling-panel'), function() {
    //     resize($(this));
    //   });
    // });
  }

  // // Take an element and place it into a scrolling panel, then return the
  // // scrolling panel. This function doesn't call build() yet because the
  // // wrapped element may not be within it's own parent yet.
  // function wrapFixed(element) {
  //   return $(`<div class='scrolling-panel track-parent'>`).append($(`<div class='scrolling-panel-content'>`).append(element));
  // }

  // function build(scrollingPanel) {
  //   var contentPanel = scrollingPanel.find('.scrolling-panel-content');
  //   if (contentPanel.length == 0) {
  //     throw "Scrolling panel must contain a .scrolling-panel-content";
  //   }

  //   // If this scrolling panel has already been built, ignore this.
  //   if (scrollingPanel.find('.scrolling-panel-track').length > 0) { return; }

  //   // If this panel should track its parent for its height, and there is no ancestor with the
  //   // scrolling-panel-parent class, then assume the immediate parent is the height source.
  //   if (scrollingPanel.hasClass('track-parent')) {
  //     if (scrollingPanel.closest('.scrolling-panel-parent').length == 0) {
  //       scrollingPanel.parent().addClass('scrolling-panel-parent');
  //     }
  //   }

  //   scrollingPanel.on('mousewheel', function(e) {
  //     if (! Elements.isScrolling) {
  //       e.preventDefault();
  //       e.stopPropagation();
  //       (e.originalEvent && e.originalEvent.deltaY > 0) ?
  //         stepDown(scrollingPanel, scrollingPanel.data('step-extent')):
  //         stepUp(scrollingPanel, scrollingPanel.data('step-extent'));
  //     }
  //   });

  //   var thumbwheel = $('<div>', { class:'scrolling-panel-thumbwheel' });
  //   var track = $('<div>', { class:'scrolling-panel-track' }).append(thumbwheel);
  //   scrollingPanel.append(track).attr('data-scroll-position',0).attr('data-thumb-position',0);

  //   resize(scrollingPanel);
  // }

  // function resize(scrollingPanel) {
  //   if (scrollingPanel.height() == 0) { return; }

  //   var contentPanel = scrollingPanel.find('.scrolling-panel-content');
  //   var track = scrollingPanel.find('.scrolling-panel-track');
  //   var thumbwheel = scrollingPanel.find('.scrolling-panel-thumbwheel');

  //   var contentHeight = contentPanel[0].scrollHeight;
  //   var visibleHeight = getVisibleHeight(scrollingPanel);

  //   if (visibleHeight >= contentHeight) {
  //     setThumbPosition(scrollingPanel, 0);
  //     return track.addClass('off');
  //   }

  //   track.removeClass('off');

  //   var thumbHeight = (visibleHeight / contentHeight) * visibleHeight;
  //   if (thumbHeight < 50) {
  //     thumbHeight = 50;
  //   }

  //   var thumbExtent = visibleHeight - thumbHeight;
  //   var thumbPosition = scrollingPanel.data('scroll-position') * thumbExtent;
  //   var stepExtent = (stepDistance / contentHeight) * visibleHeight;

  //   setThumbPosition(scrollingPanel, thumbPosition);
  //   scrollingPanel.data('thumb-extent', thumbExtent);
  //   scrollingPanel.data('step-extent', stepExtent);

  //   thumbwheel.css({
  //     height: thumbHeight
  //   });
  // }

  // function resizeAll() {
  //   $.each($('.scrolling-panel'), function(i, panel) { resize($(panel)); });
  // }

  // // If the contents of the scrolling panel are likely to change call observe() to automatically call resize()
  // // when the content panel is resized.
  // function observe(scrollingPanel) {
  //   var content = scrollingPanel.find('.scrolling-panel-content')[0];

  //   var observer = new MutationObserver(function(mutations) {
  //     resize(scrollingPanel);
  //   });

  //   observer.observe(content, {
  //     childList: true,
  //     subtree: true,
  //     attributes: false,
  //     characterData: false
  //   });
  // }

  // function setThumbPosition(scrollingPanel, position) {
  //   scrollingPanel.data('thumb-position', position);
  //   scrollingPanel.find('.scrolling-panel-thumbwheel').css({ top:position });
  //   positionView(scrollingPanel);
  // }

  // // Read the thumb-position and set view offset
  // function positionView(scrollingPanel) {
  //   var content = scrollingPanel.find('.scrolling-panel-content');
  //   var thumbExtent = scrollingPanel.data('thumb-extent');
  //   var thumbPosition = scrollingPanel.data('thumb-position') || 0;
  //   var scrollPosition = 1 - ((thumbExtent - thumbPosition) / thumbExtent);
  //   var contentOffset = 0;

  //   if (scrollPosition > 1) {
  //     scrollPosition = 1;
  //   }

  //   scrollingPanel.data('scroll-position', scrollPosition);

  //   if (scrollPosition > 0) {
  //     var contentHeight = content[0].scrollHeight;
  //     var visibleHeight = getVisibleHeight(scrollingPanel);
  //     contentOffset = (contentHeight - visibleHeight) * -scrollPosition
  //   }

  //   content.css({ top:contentOffset });
  // }

  // function stepDown(scrollingPanel, step) {
  //   if (isActive(scrollingPanel) == false) { return false; }

  //   var extent = scrollingPanel.data('thumb-extent');
  //   var position = (scrollingPanel.data('thumb-position') || 0) + step;
  //   if (position > extent) {
  //     position = extent;
  //   }
  //   setThumbPosition(scrollingPanel, position);
  // }

  // function stepUp(scrollingPanel, step) {
  //   if (isActive(scrollingPanel) == false) { return false; }

  //   var position = (scrollingPanel.data('thumb-position') || 0) - step;
  //   if (position < 0) {
  //     position = 0;
  //   }
  //   setThumbPosition(scrollingPanel, position);
  // }

  // function scrollToTop(scrollingPanel) {
  //   setThumbPosition(scrollingPanel, 0);
  // }

  // function scrollToBottom(scrollingPanel) {
  //   if (isActive(scrollingPanel)) {
  //     setThumbPosition(scrollingPanel, scrollingPanel.data('thumb-extent'));
  //   }
  // }

  // function trackScroll(e) {
  //   var scrollingPanel = $(this).closest('.scrolling-panel');
  //   let thumb = scrollingPanel.find('.scrolling-panel-thumbwheel');

  //   var clickAt = e.pageY;
  //   var thumbPosition = thumb.offset().top;
  //   var thumbHeight = thumb.height();

  //   if (clickAt < thumbPosition) {
  //     stepUp(scrollingPanel, thumbHeight);
  //   }
  //   if (clickAt > (thumbPosition + thumbHeight)) {
  //     stepDown(scrollingPanel, thumbHeight);
  //   }
  // }

  // function startDrag(e) {
  //   var scrollingPanel = $(this).closest('.scrolling-panel');
  //   scrollingPanel.data('grab', e.pageY - $(this).offset().top + $(document).scrollTop());

  //   $(document).on('mousemove', 'html > body', function(e) { moveThumb(e, scrollingPanel); });
  //   $(document).on('mouseup', 'html > body', stopDrag);
  //   $('body').on('mouseleave', stopDrag);
  // }

  // function stopDrag(e) {
  //   $(document).off('mousemove','html > body');
  //   $(document).off('mouseup','html > body');
  //   $('body').off('mouseleave');
  // }

  // function moveThumb(e, scrollingPanel) {
  //   var top = e.pageY - scrollingPanel.data('grab') - scrollingPanel.offset().top + $(document).scrollTop();
  //   var limit = scrollingPanel.data('thumb-extent');

  //   if (top < 0) { top = 0; }
  //   if (top > limit) { top = limit; }
  //   setThumbPosition(scrollingPanel, top);
  //   Elements.clearSelection();
  // }

  // function getVisibleHeight(scrollingPanel) {
  //   return scrollingPanel.hasClass('track-parent') ?
  //     scrollingPanel.closest('.scrolling-panel-parent').height():
  //     scrollingPanel.height();
  // }

  // function isActive(scrollingPanel) {
  //   return scrollingPanel.find('.scrolling-panel-track').hasClass('off') == false;
  // }

  return {
    init,
    // build,
    // resize,
    // resizeAll,
    // observe,
    // scrollToTop,
    // scrollToBottom,
    // wrapFixed,
  };

})();
