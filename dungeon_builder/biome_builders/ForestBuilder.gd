extends BiomeBuilder

class_name ForestBuilder

var sector = null

# [BiomeBuilder Implementation]
func placeFeatures():
	var size = freeTiles.size()
	var houseCount = floor(size/180)
	var treeCount = floor(size/9)

	addHouses(houseCount)
	addTrees(treeCount)
	fillSpace()

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
		tile.sector = sector
		tile.fillWithTree()

		tileSource.setTile(dungeonIndex, tile)
		removeFreeIndex(dungeonIndex)
		treeCount -= 1

# Right now we're just filling the unused tiles with empty space.
func fillSpace():
	for index in freeTiles:
		var emptyTile = Tile.normal()
		emptyTile.biome = biomeName
		emptyTile.sector = sector

		tileSource.setTile(index, emptyTile)
