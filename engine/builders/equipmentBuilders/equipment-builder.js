global.EquipmentBuilder = (function() {

  const ArmorTypes = ['head','chest','legs','hands','feet'];
  const AccessoryTypes = ['ring','neck','ear','nipple','labia','pussy','ass','cock'];

  // The equipment builder passes the build options off to the appropriate
  // builder type. If the equipment isn't armor or an accessory assume it's a
  // weapon.
  function build(options) {
    if (ArrayHelper.contains(ArmorTypes, options.type)) {
      return EquipmentBuilder.ArmorBuilder.build(options); }
    if (ArrayHelper.contains(AccessoryTypes, options.type)) {
      return EquipmentBuilder.AccessoryBuilder.build(options); }
    return EquipmentBuilder.WeaponBuilder.build(options);
  }

  return { build };

})();
