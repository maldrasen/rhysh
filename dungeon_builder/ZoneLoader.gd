extends Object

class_name ZoneLoader

var zoneName
var zoneMap
var zoneData

var layerCount
var layerSize
var layers

var chunks

func _init(name):
	self.zoneName = name
	self.chunks = {}

# A Zone has been built if its Chunk files have all been written
func hasBeenBuilt() -> bool:
	return false

# Zones are created from the JSON files in the map data directory.
func createZoneFromTemplate():
	var mapPath = "res://map_data/zones/{0}.json".format([zoneName])
	var dataPath = "res://map_data/zones/{0}Data.json".format([zoneName])
	var mapFile = FileAccess.open(mapPath, FileAccess.READ)
	var dataFile = FileAccess.open(dataPath, FileAccess.READ)

	if mapFile == null:
		return printerr("Error creating Zone({0}). No map file named {1}".format([zoneName,mapPath]))
	if dataFile == null:
		return printerr("Error creating Zone({0}). No map data file named {1}".format([zoneName,dataFile]))

	zoneMap = JSON.parse_string(mapFile.get_as_text())
	zoneData = JSON.parse_string(dataFile.get_as_text())

	if zoneMap == null || zoneData == null:
		return printerr("Parsing Error while creating Zone({0}).".format([zoneName]))

	print("Create Zone({0})".format([zoneName]))

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

			if tileData:
				var tile = Tile.fromTileData(tileData)

				if tileData.has("extended"):
					tile.addExtensions(Vector2i(x,y), tileData.extended, zoneData)

				putTileIntoChunk(DungeonIndex.new(x,y,layer.level), tile)

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
		chunks[chunkIndex] = Chunk.new(zoneName, chunkIndex)

	chunks[chunkIndex].setTile(dungeonIndex.tileIndex(), tile)
