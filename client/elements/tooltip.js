window.Tooltip = (function() {
  let tooltipLibrary = {};
  let currentTooltip;

  function init() {
    window.addEventListener('mouseover', event => {
      if (X.hasClass(event.target,'tooltip-parent')) { startOpen(event); }
    });

    window.addEventListener('mouseout', event => {
      if (X.hasClass(event.target,'tooltip-parent')) { checkClose(event); }
    });
  }

  // Tooltips fetch their content from the tooltipLibrary given their lookup
  // code. These codes are global so that we don't have to redefine them
  // everytime.
  //
  //    code*       Required for toolip lookup.
  //    content*    String or HTML element to display.
  //    position    Only bottom for now.
  //    delay       Time in ms to delay opening. 500ms by default.
  //
  // TODO: Could also add the ability to register different tool tiptypes,
  //       letting the Tooltip class itself worry about building the more
  //       advanced elements.
  function register(code, options) {
    tooltipLibrary[code] = {
      content: options.content,
      classname: options.classname,
      position: (options.position || 'bottom'),
      delay: (options.delay || 500),
    };
  }

  // Tooltips can be added to an element with the add function or if an element
  // has the tooltip-parent class and the tooltip code it should just work.
  function add(element, code) {
    X.addClass(element,'tooltip-parent');
    element.setAttribute('title',options.code);
  }

  // Set a timer that will open the tooltip if the mouse is still over the
  // tooltip element by the time the timer runs out.
  function startOpen(event) {
    currentTooltip = event.target.getAttribute('title');

    if (currentTooltip == null || tooltipLibrary[currentTooltip] == null) {
      throw `Cannot find tooltip with code ${currentTooltip}`;
    }

    setTimeout(() => {
      if (currentTooltip) { open(event.target); }
    },tooltipLibrary[currentTooltip].delay);

  }

  function open(tooltip) {
    if (tooltip.getAttribute('title') == currentTooltip) {
      console.log("Open:",tooltip,currentTooltip);

//     let offset = parent.offset();
//     let content = parent.data('tooltip-content');
//     let position = parent.data('tooltip-position') || 'bottom';

//     if (typeof content == 'string') {
//       content = $('<div>',{ class:'basic-tooltip-content' }).append(content);
//     }

//     let frame = $('#tooltipFrame').
//       empty().
//       attr('style','').
//       append(content).
//       removeClass('hide');

//     if (position == 'bottom') {
//       frame.css({
//         top: offset.top + parent.height() + 5,
//         left: offset.left
//       });
//     }

    }
  }

  // Mouseout events will be triggered from any element under the tooltip
  // parent element so on mouseout we need to check every element that we're
  // currently hovering over to see if any of them are the tooltip element
  // still.
  function checkClose(event) {
    let release = true;

//     each($(':hover'), e => {
//       if ($(e).hasClass('tooltip-parent')) { release = false; }
//     });

    if (release) { close(); }

  }

  function close() {
    console.log("Close");
    currentTooltip = null;
//     $('#tooltipFrame').attr('style','').empty().addClass('hide');
  }

  return { init, register, add, close }

})();
