global.ZoneLoader = class ZoneLoader {

  constructor(name) {
    this.zoneName = name;
  }

  hasBeenBuilt() { return false }

  loadZone() { return null }

  async createZoneFromTemplate() {
    console.log(`Building ${this.zoneName}`);

    this.zoneMap = await DungeonBuilder.loadZoneMap(this.zoneName);
    this.zoneData = await DungeonBuilder.loadZoneData(this.zoneName);
    this.zoneInfo = ZoneInfo.build(this.zoneName, this.zoneData);



  }

}