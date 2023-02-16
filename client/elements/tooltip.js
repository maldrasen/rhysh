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

    if (options.withDefinitionList) {
      tooltipLibrary[code].withDefinitionList = options.withDefinitionList;
    }
  }

  // Tooltips can be added to an element with the add function or if an element
  // has the tooltip-parent class and the tooltip code it should just work.
  function add(element, code) {
    X.addClass(element,'tooltip-parent');
    element.setAttribute('id',options.code);
  }

  // Set a timer that will open the tooltip if the mouse is still over the
  // tooltip element by the time the timer runs out.
  function startOpen(event) {
    currentTooltip = event.target.getAttribute('id');

    if (currentTooltip == null || tooltipLibrary[currentTooltip] == null) {
      throw `Cannot find tooltip with code ${currentTooltip}`;
    }

    setTimeout(() => {
      if (currentTooltip) { open(event.target); }
    },tooltipLibrary[currentTooltip].delay);

  }

  function open(parent) {
    if (parent.getAttribute('id') == currentTooltip) {

console.log("Open:",parent)

      let tooltip = tooltipLibrary[currentTooltip];
      let frame = X.first('#tooltipFrame');
      let offset = X.getPosition(parent);

      // Ensure the tooltip is empty.
      frame.innerHTML = '';

      // Tooltip strings are wrapped in a basic content div.
      if (typeof tooltip.content == 'string') {
        let content = X.createElement(`<div class='basic-tooltip-content'></div>`);
        content.innerHTML = tooltip.content;
        frame.appendChild(content);
      }

      // We can assume other content can be appended as is.
      if (typeof tooltip.content != 'string') {
        frame.appendChild(tooltip.content);
      }

      // Defination are included after other content types.
      if (tooltip.withDefinitionList) {
        let list = X.createElement('<dl></dl>');

        ObjectHelper.each(tooltip.withDefinitionList, (key, value) => {
          list.appendChild(X.createElement(`<dt>${key}</dt>`));
          list.appendChild(X.createElement(`<dd>${value}</dd>`));
        });

        frame.appendChild(list);
      }

      // Finally position and display the tooltip.
      if (tooltip.position == 'bottom') {
        frame.style['top'] = `${offset.top + offset.height}px`;
        frame.style['left'] = `${offset.left}px`;
      }

      X.addClass(frame,tooltip.classname);
      X.removeClass(frame,'hide');
    }
  }

  // Mouseout events will be triggered from any element under the tooltip
  // parent element so on mouseout we need to check every element that we're
  // currently hovering over to see if any of them are the tooltip element
  // still.
  function checkClose(event) {
    let release = true;


    console.log("Check close...")
//     each($(':hover'), e => {
//       if ($(e).hasClass('tooltip-parent')) { release = false; }
//     });

    if (release) { close(); }

  }

  function close() {
    currentTooltip = null;

    let frame = X.first('#tooltipFrame');
        frame.removeAttribute('style');
        frame.setAttribute('class','hide')
        frame.innerHTML = '';
  }

  return { init, register, add, close }

})();
