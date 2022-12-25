extends Node

class_name BiomeBuilder

var biome
var freeTiles

func _init(biome_, freeTiles_):
	self.biome = biome_
	self.freeTiles = freeTiles_

# [BiomeBuilder Implementation]
func fullBuild():
	print("---")
	print("{0}: Starting full build on {1} tiles".format([BiomeManager.biomeToString(biome),freeTiles.size()]))
	placeFeatures()
	connectRegions()
	trimDeadEnds()
	decorate()

# [BiomeBuilder Implementation]
func placeFeatures():
	pass

# [BiomeBuilder Implementation]
func connectRegions():
	pass

# [BiomeBuilder Implementation]
func trimDeadEnds():
	pass

# [BiomeBuilder Implementation]
func decorate():
	pass
