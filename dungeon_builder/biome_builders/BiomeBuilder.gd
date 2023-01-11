extends Object

class_name BiomeBuilder

var status
var biomeName
var zoneInfo
var zoneData

var chunks
var freeTiles
var usedTiles
var supplementaryData

var random: RandomNumberGenerator

func _init(properties):
	self.status = Constants.Status.Working
	self.biomeName = properties.biomeName
	self.zoneInfo = properties.zoneInfo
	self.zoneData = properties.zoneData
	self.chunks = properties.chunks

	self.freeTiles = properties.freeTiles
	self.usedTiles = []
	self.supplementaryData = properties.supplementaryData

	self.random = RandomNumberGenerator.new()
	self.random.seed = "{0}{1}".format([GameState.randomSeed, self.zoneInfo.name]).hash()

# [BiomeBuilder Implementation]
func fullBuild():
	print("  ---")
	print("  {0}: Starting full build on {1} tiles".format([biomeName,freeTiles.size()]))
	placeFeatures()
	connectSectors()
	trimDeadEnds()
	decorate()

# [BiomeBuilder Implementation]
func placeFeatures():
	pass

# [BiomeBuilder Implementation]
func connectSectors():
	pass

# [BiomeBuilder Implementation]
func trimDeadEnds():
	pass

# [BiomeBuilder Implementation]
func decorate():
	pass

# When setting the free tiles array we want to force a copy because the builders mutate the free
# and used tile arrays while building, however if we need to abort the build and try again we need
# a fresh set of free tiles.
func setFreeTiles(tiles):
	self.freeTiles = [] + tiles
	self.usedTiles = []

func setTile(dungeonIndex:DungeonIndex, tile:Tile):
	chunks[dungeonIndex.chunkIndex()].setTile(dungeonIndex.tileIndex(), tile)

func getTile(dungeonIndex:DungeonIndex):
	return chunks[dungeonIndex.chunkIndex()].getTile(dungeonIndex.tileIndex())

func inRange(dungeonIndex:DungeonIndex):
	if chunks.has(dungeonIndex.chunkIndex()) == false:
		return false


# Given a dungeon index, get the neighboring tiles along with their indices.
#   { N:{index:<>, tile:<>}, S:... }
func getNeighborTiles(dungeonIndex:DungeonIndex):
	var neighbors = {
		Constants.North: { "index":dungeonIndex.translate(Vector3i(0,-1,0)) },
		Constants.South: { "index":dungeonIndex.translate(Vector3i(0,1,0))  },
		Constants.East:  { "index":dungeonIndex.translate(Vector3i(1,0,0))  },
		Constants.West:  { "index":dungeonIndex.translate(Vector3i(-1,0,0)) },
	}

	neighbors[Constants.North].tile = getTile(neighbors[Constants.North].index)
	neighbors[Constants.South].tile = getTile(neighbors[Constants.South].index)
	neighbors[Constants.East].tile = getTile(neighbors[Constants.East].index)
	neighbors[Constants.West].tile = getTile(neighbors[Constants.West].index)

	return neighbors

# Determine if a feature is able to be placed in this location. This only checks to see if there's
# a null tile at every index the feature's tiles would be placed in. It doesn't look for things
# like doors being able to be connected. We could extend it to do that possibly or create some kind
# of abort() function that clears tiles if it becomes impossible to connect the feature.
func featureCanBePlaced(index:DungeonIndex, feature:Feature):
	for z in feature.size.z:
		for y in feature.size.y:
			for x in feature.size.x:
				if feature.getTile(x,y,z) != null:
					var tileIndex = index.translate(Vector3i(x,y,z))
					if isIndexFree(tileIndex) == false:
						return false
	return true

# Place the feature in the dungeon. This is also where the feature becomes 'real' so we set the
# biome and sector values in the tiles and update the sector data.
func placeFeature(baseIndex:DungeonIndex, feature:Feature):
	var sector = Dungeon.nextSector()
	Dungeon.defineSector(sector, feature.sectorType)

	for z in feature.size.z:
		for y in feature.size.y:
			for x in feature.size.x:
				var tile = feature.getTile(x,y,z)
				if tile != null:
					var index = baseIndex.translate(Vector3i(x,y,z))
					tile.biome = biomeName
					tile.sector = sector
					setTile(index, tile)
					removeFreeIndex(index)

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
