extends Object

class_name BiomeBuilder

var biome
var status
var freeTiles
var usedTiles

func _init(biome_):
	self.status = Constants.Status.Working
	self.biome = biome_

# When setting the free tiles array we want to force a copy because the builders mutate the free
# and used tile arrays while building, however if we need to abort the build and try again we need
# a fresh set of free tiles.
func setFreeTiles(tiles):
	self.freeTiles = [] + tiles
	self.usedTiles = []

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

# Appearently all the array has() and find() functions only work on varient types and not on plain
# objects. There doesn't seem to be any way to implement an equality function either. I guess the
# only solution is to loop though an array like a caveman.
func isIndexFree(tileIndex:DungeonIndex):
	for freeIndex in freeTiles:
		if freeIndex.index == tileIndex.index:
			return true
	return false

# As features are placed we need to remove the indices for the tiles that have been used. We also
# keep track of tiles we've placed here for follow on processing.
func removeFreeIndex(tileIndex:DungeonIndex):
	for i in freeTiles.size():
		if freeTiles[i].index == tileIndex.index:
			usedTiles.push_back(tileIndex)
			return freeTiles.remove_at(i)
