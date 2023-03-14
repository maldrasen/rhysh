global.EquipmentBuilder = (function() {

  // The equipment builder passes the build options off to the appropriate
  // builder type. If the equipment isn't armor or an accessory assume it's a
  // weapon.
  function build(options) {
    if (options.type == null) { throw `EquipmentBuilder at least requires a type` }
    if (ArrayHelper.contains(ArmorSlots, options.type)) { return EquipmentBuilder.ArmorBuilder.build(options); }
    if (ArrayHelper.contains(AccessorySlots, options.type)) { return EquipmentBuilder.AccessoryBuilder.build(options); }
    return EquipmentBuilder.WeaponBuilder.build(options);
  }

  return { build };

})();
