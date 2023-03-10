window.OptionsOverlay = (function() {

  const FontSizes = {
    1: 8,
    2: 9,
    3: 10,
    4: 12,
    5: 14,
    6: 16,
    7: 18,
    8: 20,
    9: 24,
  };

  const WindowColors = {
    1: 'Light',
    2: 'Dark',
    3: 'Very Dark',
    4: 'Black',
    5: 'Brown',
    6: 'Red',
    7: 'Blue',
    8: 'Green',
  };

  let $fontSizeSlider;
  let $windowColorSlider;
  let $futaButtons;

  function init() {
    X.onCodeDown(27, isOpen, close);
    X.onClick('#optionsOverlay a.close-button', close);
    X.onClick('#optionsOverlay a.save-button', save);
  }

  function build() {
    Template.load('#optionsOverlay','client/views/mainMenu/options-overlay.html').then(loaded => {
      ScrollingPanel.build('#optionsOverlay .scrolling-panel');

      $futaButtons = new RadioButtons({
        currentValue: 'shi',
        onSelect: (x) => { console.log("On Select?",x); },
        choices: [
          { value:'shi', label:'Shi/Hir' },
          { value:'she', label:'She/Her' },
        ]
      });

      $fontSizeSlider = new Slider({
        id: 'fontSizeSlider',
        parent: X.first('#fontSizeContainer'),
        min: 1,
        max: 9,
        formatter: value => { return `${FontSizes[value]} point` },
        onChange: event => { updateEventExample(); },
      });
      $fontSizeSlider.build();

      $windowColorSlider = new Slider({
        id: 'windowColorSlider',
        parent: X.first('#windowColorContainer'),
        min: 1,
        max: 8,
        formatter: value => { return `${WindowColors[value]}` },
        onChange: event => { updateEventExample(); },
      });
      $windowColorSlider.build();
    });
  }

  function show() {
    let mainMenu = X.first('#mainMenu');

    $futaButtons.setValue(Options.futaPronouns);
    $fontSizeSlider.setValue(Options.fontSize);
    $windowColorSlider.setValue(Options.windowColor);
    updateEventExample();

    if (mainMenu) {
      X.addClass(mainMenu,'hide');
    }

    X.removeClass('#optionsOverlay','hide');

    ScrollingPanel.resize('#optionsOverlay .scrolling-panel');

  }

  function updateEventExample(event) {
    let fontSize = $fontSizeSlider.getValue();
    let windowColor = $windowColorSlider.getValue();

    X.first('#eventExample').setAttribute('class',`window-color-${windowColor} font-size-${fontSize}`);

    if (EventView.isOpen()) {
      EventView.setTextWindowStyle(fontSize, windowColor);
    }

    ScrollingPanel.resize('#optionsOverlay .scrolling-panel');
  }

  function close() {
    X.addClass('#optionsOverlay','hide');
    X.removeClass('#mainMenu','hide');
  }

  function isOpen() {
    return X.hasClass('#optionsOverlay','hide') == false;
  }

  function save() {
    Options.fontSize = $fontSizeSlider.getValue();
    Options.windowColor = $windowColorSlider.getValue();

    ClientCommands.send('options.save',Options).then(status => {
      if (status == 'success') {
        new Alert({
          message: 'Options Saved',
          position: 'side',
          classname: 'save-game-alert success'
        }).display();
      }
    });

    close();
  }

  return {
    init,
    build,
    show,
    isOpen,
  };

})();