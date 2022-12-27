extends BiomeBuilder

class_name LightForestBuilder

# [BiomeBuilder Implementation]
func placeFeatures():
	var region = DungeonBuilder.PredefinedRegions.LightForestOutside.index
	var houseCount = randi_range(5,8)
	var treeCount = randi_range(50,70)

	# Place a few houses outside of the city wall.
	while houseCount > 0:
		var featureName = FeatureLibrary.featureSets["houses"].pick_random()
		var feature = Feature.new(featureName)
		feature.randomFlip()

		var dungeonIndex = self.freeTiles.pick_random()
		if featureCanBePlaced(dungeonIndex,feature) == false:
			continue

		placeFeature(dungeonIndex,feature)
		houseCount -= 1

	# Add a few trees. The area will still be fairly open.
	while treeCount > 0:
		var dungeonIndex = self.freeTiles.pick_random()

		if isIndexFree(dungeonIndex) == false:
			continue

		var tile = Tile.normal()
		tile.biome = biome
		tile.region = region
		tile.type = Tile.Type.Solid
		tile.fill = { "tree":"random" } # TODO: Trees will have actual types at some point.

		Dungeon.setTile(dungeonIndex, tile)
		removeFreeIndex(dungeonIndex)
		treeCount -= 1



# [BiomeBuilder Implementation]
func connectRegions():
	pass

# [BiomeBuilder Implementation]
func trimDeadEnds():
	pass

# [BiomeBuilder Implementation]
func decorate():
	pass
