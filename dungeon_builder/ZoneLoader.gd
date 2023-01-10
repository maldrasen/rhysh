extends Object

class_name ZoneLoader

var chunks
var freeTiles
var connectionPoints

var zoneInfo
var zoneMap
var zoneData

var layerSize
var layers

# When we make a zone loader, we seed a new random number generator using the zone name and the
# game seed. This should ensure that zones within a game will be built consistantly, even if they
# are built in a different order.
func _init(name):
	self.zoneInfo = ZoneInfo.new(name)
	self.connectionPoints = []
	self.freeTiles = {}
	self.chunks = {}

# ==== Managing Chunks =============================================================================

func zoneChunkFiles():
	var world = DirAccess.open("user://worlds/{0}/".format([GameState.currentWorld]))
	var files = []

	for filename in world.get_files():
		if filename.begins_with("{0}[".format([self.zoneInfo.name])):
			files.push_back(filename)

	return files

# A Zone has been built if its Chunk files have all been written. If this is insufficient I could
# also check the number of files. I'm going to need to persist the zone state as well so I could
# check for that file once I start making them.
func hasBeenBuilt() -> bool:
	return zoneChunkFiles().size() > 0

# If a zone has already been built all we need to do is load all the associated chunk files.
func loadZoneChunks():
	for filename in zoneChunkFiles():
		var path = "user://worlds/{0}/{1}".format([GameState.currentWorld,filename])
		var chunk = Chunk.loadChunkFile(path)
		self.chunks[chunk.chunkIndex] = chunk

# ==== Zone Creation ===============================================================================
# Zones are created from the JSON files in the map data directory. We first create tiles from the
# map data and store them into chunks. We then take any free tiles from the map's biome areas and
# randomly generate their contents. We then do a final pass to decorate the tiles and to verify all
# the walls and such are set correctly, then finally save the complete chunk files.

func createZoneFromTemplate():
	self.zoneMap = MapData.loadZoneMap(self.zoneInfo.name)
	self.zoneData = MapData.loadZoneData(self.zoneInfo.name)
	self.zoneInfo.buildFromData(self.zoneData)

	self.layerSize = Vector2i(self.zoneMap.layers[0].gridCellsX, self.zoneMap.layers[0].gridCellsY)
	self.layers = []

	loadMapData()
	generateBiomes()
	saveChunks()

# ==== Step 1 : Load Map Data ======================================================================

func loadMapData():
	print("Create Zone({0})".format([self.zoneInfo.name]))

	for layerData in self.zoneData.layers:
		var tileData = []
		tileData.resize(self.layerSize.x * self.layerSize.y)

		layerData.tileData = tileData
		self.layers.push_back(layerData)

	for layerMap in self.zoneMap.layers:
		loadLayer(layerMap)

	for layer in self.layers:
		buildTiles(layer)

	print("Map Data Loaded")

# Get all of the tile data from the Zone and put it the tile array for this layer. We need to do
# this step before building the tiles because tile data can come from multiple separate map layers.
# There are also region layers but I'm ignoring them for now until they have a purpose. They'll be
# used to do things like change encounter rates, levels, or tables. Set enviromental effects over
# an area, that sort of thing.
func loadLayer(layerMap):
	var layerInfo = MapData.parseLayerName(layerMap.name)
	var layer = self.layers[layerInfo.index]
	var extensionLoader = ExtensionLoader.new(zoneData)

	for y in self.layerSize.y:
		for x in self.layerSize.x:
			var tileIndex = x + (y * self.layerSize.x)
			var tileId = -1

			if layerMap.has("data2D"):
				tileId = layerMap.data2D[y][x]

			if tileId >= 0:
				if layer.tileData[tileIndex] == null:
					layer.tileData[tileIndex] = {}

				layer.tileData[tileIndex][layerInfo.type] = extensionLoader.adjustedLayerData(
					layerInfo.type, tileId, Vector3i(x,y,layer.level))

# Now that we have all the data for each tile we can build all the tiles, adding them to a single
# tile array.
func buildTiles(layer):
	print("  Build Layer: ",layer.level)

	for y in self.layerSize.y:
		for x in self.layerSize.x:
			var zoneIndex = x + (y * self.layerSize.x)
			var tileData = layer.tileData[zoneIndex]
			if tileData:
				if tileData.root.has("biome"):
					saveAsFreeTile(DungeonIndex.new(x,y,layer.level), tileData)
				if tileData.root.has("tile"):
					putTileIntoChunk(DungeonIndex.new(x,y,layer.level), Tile.fromTileData(tileData))

# As we go through the layers we save biomes as an array of points. These will be fed into the
# biome builders to randomly generate these areas.
func saveAsFreeTile(dungeonIndex, tileData):
	var biomeName = self.zoneInfo.biomes[tileData.root.biome]
	if self.freeTiles.has(biomeName) == false:
		self.freeTiles[biomeName] = []
	self.freeTiles[biomeName].push_back(dungeonIndex)

	# The connection points are still super in progress. I needed some way to flag a tile to force
	# the biome builder to build a path to that tile. Not sure yet if that's a common problem to
	# have or it's just the cleft and other random walk builders that are going to have that
	# problem. This feels icky and it's a definite code smell, but I'm not sure yet what's wrong
	# with it or how it can be improved.
	#
	# How I think this will work is the first step of the biome builder will be to select all
	# connection points and build those paths first. Once those are taken care of we can fill the
	# rest of the tiles in.
	if tileData.has("extended") && tileData.extended.value == "Connection":
		self.connectionPoints.push_back(dungeonIndex)

# Place a tile into the appropriate chunk. If the chunk hasn't been built yet this creates it.
func putTileIntoChunk(dungeonIndex:DungeonIndex, tile:Tile):
	var chunkIndex = dungeonIndex.chunkIndex()

	if self.chunks.has(chunkIndex) == false:
		self.chunks[chunkIndex] = Chunk.new(self.zoneInfo.name, chunkIndex)

	self.chunks[chunkIndex].setTile(dungeonIndex.tileIndex(), tile)

# ==== Step 2 : Generate Biomes ====================================================================

func generateBiomes():
	for biomeName in freeTiles.keys():
		var properties = {
			"biomeName": biomeName,
			"zoneInfo": self.zoneInfo,
			"zoneData": self.zoneData,
			"chunks": self.chunks,
			"freeTiles": self.freeTiles[biomeName],
			"connectionPoints": self.connectionPoints,
		}

		if biomeName == "Cleft":
			CleftBuilder.new(properties).fullBuild()
		if biomeName == "Farm":
			FarmBuilder.new(properties).fullBuild()
		if biomeName == "Forest":
			ForestBuilder.new(properties).fullBuild()

	print("  ---")

# The last step is to save all the chunk files.
func saveChunks():
	print("Zone creation complete. Saving chunks.")
	for index in self.chunks:
		self.chunks[index].save()
