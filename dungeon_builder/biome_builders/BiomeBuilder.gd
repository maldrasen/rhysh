extends Object

class_name BiomeBuilder

var biomeName
var zoneInfo
var zoneData

var tileSource
var freeTiles
var usedTiles
var supplementaryData

var extraBuilders

func _init(properties):
	self.biomeName = properties.biomeName
	self.zoneInfo = properties.zoneInfo
	self.zoneData = properties.zoneData
	self.tileSource = properties.tileSource

	self.freeTiles = properties.freeTiles
	self.usedTiles = []
	self.supplementaryData = properties.supplementaryData

	if properties.has("extraBuilders"):
		self.extraBuilders = properties.extraBuilders


# [BiomeBuilder Implementation]
func fullBuild():
	var startTime = Time.get_ticks_msec()

	print("  ---")
	print("  {0}: Starting full build on {1} tiles".format([biomeName,freeTiles.size()]))

	runExtraBuilders("First")
	placeFeatures()
	connectSectors()
	trimDeadEnds()
	decorate()
	runExtraBuilders("Last")

	print("  {0}: Completed build in {1}ms".format([biomeName, Time.get_ticks_msec() - startTime]))

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

# [BiomeBuilder Implementation]
func defaultTile():
	pass

# A zone can specify additional options for the biome builders to use. One of these is the
# "extraBuilders" option, which lists extra build functions to invoke. The option needs to at least
# specify which builder to use and which phase to run it in.
func runExtraBuilders(phase):
	if extraBuilders != null:
		for extraBuilder in extraBuilders:
			if extraBuilder.phase == phase:
				if extraBuilder.type == "Bulldozer":
					runBulldozer(extraBuilder)

func runBulldozer(options):
	Bulldozer.new({
		"biomeBuilder": self,
		"tileSource": tileSource,
		"startPoint": options.startPoint,
		"direction":  options.direction,
		"defaultTile": defaultTile(),
	}).start()

# When setting the free tiles array we want to force a copy because the builders mutate the free
# and used tile arrays while building, however if we need to abort the build and try again we need
# a fresh set of free tiles.
func setFreeTiles(tiles):
	self.freeTiles = [] + tiles
	self.usedTiles = []

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
					tileSource.setTile(index, tile)
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
