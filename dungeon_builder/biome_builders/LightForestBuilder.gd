extends BiomeBuilder

class_name LightForestBuilder

# [BiomeBuilder Implementation]
func placeFeatures():
	var houseCount = randi_range(5,8)

	while houseCount > 0:
		var featureName = FeatureLibrary.featureSets["houses"].pick_random()
		var feature = Feature.new(featureName)
		feature.randomFlip()

		var dungeonIndex = self.freeTiles.pick_random()
		if featureCanBePlaced(dungeonIndex,feature) == false:
			continue

		print("Place House at ",dungeonIndex.displayString())
		placeFeature(dungeonIndex,feature)
		houseCount -= 1



# [BiomeBuilder Implementation]
func connectRegions():
	pass

# [BiomeBuilder Implementation]
func trimDeadEnds():
	pass

# [BiomeBuilder Implementation]
func decorate():
	pass
