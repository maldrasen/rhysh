global.EquipmentBuilder = (function() {

  // The equipment builder passes the build options off to the appropriate
  // builder type. If the equipment isn't armor or an accessory assume it's a
  // weapon.
  function build(options) {

    if (options.slot && ArrayHelper.contains(ArmorSlots, options.slot)) {
      return EquipmentBuilder.ArmorBuilder.build(options);
    }
    if (options.slot && ArrayHelper.contains(AccessorySlots, options.slot)) {
      return EquipmentBuilder.AccessoryBuilder.build(options);
    }
    if (options.type == 'shield') { return
      EquipmentBuilder.AccessoryBuilder.build(options);
    }
    if (options.weaponType || options.type == 'weapon') {
      return EquipmentBuilder.WeaponBuilder.build(options);
    }

    throw `Unrecognized EquipmentBuilder Options: ${JSON.stringify(options)}`
  }

  return { build };

})();
