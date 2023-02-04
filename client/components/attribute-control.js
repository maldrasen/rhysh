
const AttributeControlTemplate = `
  <div class='attribute-control'>
    <ul class='attribute-list'>
      <li class='attribute str'>
        <div class='name'>Strength</div>
        <div class='value'>0</div>
        <div class='controls'></div>
      </li>
      <li class='attribute dex'>
        <div class='name'>Dexterity</div>
        <div class='value'>0</div>
        <div class='controls'></div>
      </li>
      <li class='attribute con'>
        <div class='name'>Constitution</div>
        <div class='value'>0</div>
        <div class='controls'></div>
      </li>
      <li class='attribute int'>
        <div class='name'>Intelligence</div>
        <div class='value'>0</div>
        <div class='controls'></div>
      </li>
      <li class='attribute wis'>
        <div class='name'>Wisdom</div>
        <div class='value'>0</div>
        <div class='controls'></div>
      </li>
      <li class='attribute cha'>
        <div class='name'>Charisma</div>
        <div class='value'>0</div>
        <div class='controls'></div>
      </li>
    </ul>
  </div>
`;

window.AttributeControl = class AttributeControl {

  constructor() {
    this.element = X.createElement(AttributeControlTemplate);
  }

  // Should be in the format { str:10, dex:12... }
  setAttributes(attributeMap) {
    this.attributes = attributeMap;
    ObjectHelper.each(attributeMap, name => {
      this.element.querySelectorAll(`li.${name} .value`)[0].textContent = attributeMap[name];
    });
  }

  getAttributes() { return this.attributes; }
  getElement() { return this.element; }

}