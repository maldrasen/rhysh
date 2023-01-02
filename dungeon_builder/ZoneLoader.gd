extends Object

class_name ZoneLoader

var random: RandomNumberGenerator
var chunks
var freeTiles

var zoneInfo
var zoneMap
var zoneData

var layerCount
var layerSize
var layers

# TODO: The only zone that currently exists is the Wolgur zone. It doesn't have any biomes or free
#       tiles though. I'm going to need to build the next zone which will have some mountains and
#       some farm land, both of which will be biomes which will need to be randomly built once the
#       layers are all loaded, but before we save the chunks off.

# When we make a zone loader, we seed a new random number generator using the zone name and the
# game seed. This should ensure that zones within a game will be built consistantly, even if they
# are built in a different order.
func _init(name):
	self.zoneInfo = ZoneInfo.new(name)
	self.freeTiles = {}
	self.chunks = {}
	self.random = RandomNumberGenerator.new()
	self.random.seed = "{0}{1}".format([GameState.randomSeed, zoneInfo.name]).hash()

func zoneChunkFiles():
	var world = DirAccess.open("user://worlds/{0}/".format([GameState.currentWorld]))
	var files = []

	for filename in world.get_files():
		if filename.begins_with("{0}[".format([zoneInfo.name])):
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
		chunks[chunk.chunkIndex] = chunk

# Zones are created from the JSON files in the map data directory.
func createZoneFromTemplate():
	loadZoneMap()
	loadZoneData()

	print("Create Zone({0})".format([zoneInfo.name]))

	self.layerCount = zoneData.layers.size()
	self.layerSize = Vector2i(zoneMap.layers[0].gridCellsX, zoneMap.layers[0].gridCellsY)
	self.layers = []

	for layerData in zoneData.layers:
		var tileData = []
		tileData.resize(layerSize.x * layerSize.y)

		layerData.tileData = tileData
		layers.push_back(layerData)

	for layerMap in zoneMap.layers:
		loadLayer(layerMap)

	for layer in layers:
		buildTiles(layer)

	for index in chunks:
		chunks[index].save()

func loadZoneMap():
	var mapPath = "res://map_data/zones/{0}.json".format([zoneInfo.name])
	var mapFile = FileAccess.open(mapPath, FileAccess.READ)

	if mapFile == null:
		return printerr("Error creating Zone({0}). No map file named {1}".format([zoneInfo.name,mapPath]))

	self.zoneMap = JSON.parse_string(mapFile.get_as_text())
	if self.zoneMap == null:
		return printerr("Parsing Error, cannot read {0}".format([mapPath]))

func loadZoneData():
	var dataPath = "res://map_data/zones/{0}Data.json".format([zoneInfo.name])
	var dataFile = FileAccess.open(dataPath, FileAccess.READ)

	if dataFile == null:
		return printerr("Error creating Zone({0}). No map data file named {1}".format([zoneInfo.name,dataFile]))

	self.zoneData = JSON.parse_string(dataFile.get_as_text())
	if self.zoneData == null:
		return printerr("Parsing Error, cannot read {0}".format([dataPath]))

	self.zoneInfo.buildFromData(zoneData)

# Get all of the tile data from the Zone and put it the tile array for this layer. We need to do
# this step before building the tiles because tile data can come from multiple separate map layers.
# There are also region layers but I'm ignoring them for now until they have a purpose. They'll be
# used to do things like change encounter rates, levels, or tables. Set enviromental effects over
# an area, that sort of thing.
func loadLayer(layerMap):
	var layerInfo = parseLayerName(layerMap.name)

	for y in self.layerSize.y:
		for x in self.layerSize.x:
			var tileIndex = x + (y * self.layerSize.y)
			var tileId = -1

			if layerMap.has("data2D"):
				tileId = layerMap.data2D[y][x]

			if tileId >= 0:
				var layer = self.layers[layerInfo.index]
				if layer.tileData[tileIndex] == null:
					layer.tileData[tileIndex] = {}

				layer.tileData[tileIndex][layerInfo.type] = MapData.lookup(layerInfo.type, tileId)

# Now that we have all the data for each tile we can build all the tiles, adding them to a single
# tile array.
func buildTiles(layer):
	print("  Build Layer: ",layer.level)

	for y in layerSize.y:
		for x in layerSize.x:
			var zoneIndex = x + (y * self.layerSize.y)
			var tileData = layer.tileData[zoneIndex]

			# TODO: Tile data may not represent a tile, but a biome instead.
			if tileData:
				var tile = Tile.fromTileData(tileData)
				applyExtension(tile,tileData,Vector2i(x,y))
				putTileIntoChunk(DungeonIndex.new(x,y,layer.level), tile)


# Most of these decorate a tile or add triggers to it. None of these things exist yet though which
# makes it hard to actually implement this function.
func applyExtension(tile,tileData,index):
	if tileData.has("extended") == false:
		return

	# var type = tileData.extended.type
	# print("    Apply Extension ({0}):{1}".format([index,tileData.extended]))
	tile.addExtensions(index, tileData.extended, zoneData)

# We use the layer's name to determine the layer type and which level it's for.
func parseLayerName(name):
	for result in Static.ZoneLayerPattern.search_all(name):
		if result.strings.size() == 3:
			return {
				"type": result.strings[1].to_lower(),
				"index": int(result.strings[2]) - 1 }
	printerr("Unparsable Layer Name: ",name)


func putTileIntoChunk(dungeonIndex:DungeonIndex, tile:Tile):
	var chunkIndex = dungeonIndex.chunkIndex()

	if chunks.has(chunkIndex) == false:
		chunks[chunkIndex] = Chunk.new(zoneInfo.name, chunkIndex)

	chunks[chunkIndex].setTile(dungeonIndex.tileIndex(), tile)
