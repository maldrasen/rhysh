extends BiomeBuilder

class_name FarmBuilder

var farmSector
var farmTile

# [BiomeBuilder Implementation]
func placeFeatures():
	farmSector = Dungeon.nextSector()
	Dungeon.defineSector(farmSector, "outside")

	farmTile = Tile.normal()
	farmTile.biome = biomeName
	farmTile.sector = farmSector

	addHouses(self.biomeOptions.houseCount)
	addTrees(self.biomeOptions.treeCount)
	fillSpace()

# [BiomeBuilder Implementation]
func connectSectors():
	pass

# [BiomeBuilder Implementation]
func trimDeadEnds():
	pass

# [BiomeBuilder Implementation]
func decorate():
	pass

# Place a few houses.
func addHouses(houseCount):
	while houseCount > 0:
		var feature = MapData.randomFeatureFromSet("farms")
		feature.randomFlip()

		var dungeonIndex = self.freeTiles.pick_random()
		if featureCanBePlaced(dungeonIndex,feature) == false:
			continue

		placeFeature(dungeonIndex,feature)

		houseCount -= 1

# Add a few trees. The area will still be fairly open.
func addTrees(treeCount):
	while treeCount > 0:
		var dungeonIndex = self.freeTiles.pick_random()

		if isIndexFree(dungeonIndex) == false:
			continue

		var tile = Tile.normal()
		tile.biome = biomeName
		tile.sector = farmSector
		tile.fillWithTree()

		tileSource.setTile(dungeonIndex, tile)
		removeFreeIndex(dungeonIndex)
		treeCount -= 1

# Fill the unused tiles with empty space.
func fillSpace():
	for index in freeTiles:
		tileSource.setTile(index, farmTile.copy())
