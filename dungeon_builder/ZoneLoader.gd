extends Object

class_name ZoneLoader

var chunks
var freeTiles

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
	self.zoneMap = ZoneData.loadZoneMap(self.zoneInfo.name)
	self.zoneData = ZoneData.loadZoneData(self.zoneInfo.name)
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
	var layerInfo = ZoneData.parseLayerName(layerMap.name)
	var layer = self.layers[layerInfo.index]

	for y in range(0, self.layerSize.y - 1):
		for x in range(0, self.layerSize.x - 1):
			var tileIndex = x + (y * self.layerSize.x)
			var tileId = -1

			if layerMap.has("data2D"):
				tileId = layerMap.data2D[y][x]

			if tileId >= 0:
				if layer.tileData[tileIndex] == null:
					layer.tileData[tileIndex] = {}

				layer.tileData[tileIndex][layerInfo.type] = MapData.lookup(layerInfo.type, tileId)

# Now that we have all the data for each tile we can build all the tiles, adding them to a single
# tile array.
func buildTiles(layer):
	print("  Build Layer: ",layer.level)

	for y in range(0, self.layerSize.y - 1):
		for x in range(0, self.layerSize.x - 1):
			var zoneIndex = x + (y * self.layerSize.x)
			var tileData = layer.tileData[zoneIndex]
			if tileData:

				if tileData.root.has("biome"):
					saveAsFreeTile(DungeonIndex.new(x,y,layer.level), tileData.root.biome)

				if tileData.root.has("tile"):
					var tile = Tile.fromTileData(tileData)
					applyExtension(tile,tileData,Vector2i(x,y))
					putTileIntoChunk(DungeonIndex.new(x,y,layer.level), tile)

# As we go through the layers we save biomes as an array of points. These will be fed into the
# biome builders to randomly generate these areas.
func saveAsFreeTile(dungeonIndex, biomeKey):
	var biomeName = self.zoneInfo.biomes[biomeKey]
	if self.freeTiles.has(biomeName) == false:
		self.freeTiles[biomeName] = []
	self.freeTiles[biomeName].push_back(dungeonIndex)

# Most of these decorate a tile or add triggers to it. None of these things exist yet though which
# makes it hard to actually implement this function.
func applyExtension(tile,tileData,index):
	if tileData.has("extended") == false:
		return

	# var type = tileData.extended.type
	# print("    Apply Extension ({0}):{1}".format([index,tileData.extended]))
	tile.addExtensions(index, tileData.extended, self.zoneData)

# Place a tile into the appropriate chunk. If the chunk hasn't been built yet this creates it.
func putTileIntoChunk(dungeonIndex:DungeonIndex, tile:Tile):
	var chunkIndex = dungeonIndex.chunkIndex()

	if self.chunks.has(chunkIndex) == false:
		self.chunks[chunkIndex] = Chunk.new(self.zoneInfo.name, chunkIndex)

	self.chunks[chunkIndex].setTile(dungeonIndex.tileIndex(), tile)

# ==== Step 2 : Generate Biomes ====================================================================

func generateBiomes():
	var builder = ZoneBuilder.new({
		"chunks": self.chunks,
		"freeTiles": self.freeTiles,
		"zoneInfo": self.zoneInfo,
		"zoneData": self.zoneData,
	})
	builder.generateBiomes()

# The last step is to save all the chunk files.
func saveChunks():
	print("Zone creation complete. Saving chunks.")
	for index in self.chunks:
		self.chunks[index].save()
