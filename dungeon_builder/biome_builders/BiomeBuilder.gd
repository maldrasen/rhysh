extends Object

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

# Place the feature in the dungeon. This is also where the feature becomes 'real' so we set the
# biome and region values in the tiles and update the region data.
func placeFeature(index, feature):
	var region = Dungeon.nextRegion()
	Dungeon.defineRegion(region, feature.regionType)

	for y in Constants.ChunkSize:
		for x in Constants.ChunkSize:
			var tile = feature.getTile(x,y)
			if tile != null:
				var tileIndex = index.translate(Vector3i(x,y,0))
				tile.biome = biome
				tile.region = region
				Dungeon.setTile(tileIndex, tile)
				removeFreeIndex(tileIndex)

# Determine if a feature is able to be placed in this location. This only checks to see if there's
# a null tile at every index the feature's tiles would be placed in. It doesn't look for things
# like doors being able to be connected. We could extend it to do that possibly or create some kind
# of abort() function that clears tiles if it becomes impossible to connect the feature.
func featureCanBePlaced(index, feature):
	for y in Constants.ChunkSize:
		for x in Constants.ChunkSize:
			if feature.getTile(x,y) != null:
				var tileIndex = index.translate(Vector3i(x,y,0))
				if isIndexFree(tileIndex) == false:
					return false
	return true

# Appearently all the array has() and find() functions only work on varient types and not on plain
# objects. There doesn't seem to be any way to implement an equality function either. I guess the
# only solution is to loop though an array like a caveman.
func isIndexFree(tileIndex:DungeonIndex):
	for freeIndex in freeTiles:
		if freeIndex.index == tileIndex.index:
			return true
	return false

func removeFreeIndex(tileIndex:DungeonIndex):
	for i in freeTiles.size():
		if freeTiles[i].index == tileIndex.index:
			return freeTiles.remove_at(i)
