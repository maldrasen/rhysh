extends Object

class_name ZoneLoader

var zoneName
var zoneMap
var zoneData

var layerCount
var layerSize
var layers

var tileArray

func _init(name):
	self.zoneName = name

	var mapPath = "map_data/zones/{0}.json".format([self.zoneName])
	var dataPath = "map_data/zones/{0}Data.json".format([self.zoneName])

	zoneMap = JSON.parse_string(FileAccess.open(mapPath, FileAccess.READ).get_as_text())
	zoneData = JSON.parse_string(FileAccess.open(dataPath, FileAccess.READ).get_as_text())

	if zoneMap && zoneData:
		print("Loading Zone({0})".format([name]))
		loadMap()
	else:
		printerr("Error loading Zone({0}). Some kinda problem with the map or data file.".format([name]))

func loadMap():
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

	self.tileArray = []
	self.tileArray.resize(layerSize.x * layerSize.y)

	for y in layerSize.y:
		for x in layerSize.x:
			var tileIndex = x + (y * self.layerSize.y)
			var tileData = layer.tileData[tileIndex]
			if tileData:
				var tile = Tile.fromTileData(tileData)

				if tileData.has("extended"):
					tile.addExtensions(Vector2i(x,y), tileData.extended, zoneData)

				self.tileArray[tileIndex] = tile

# We use the layer's name to determine the layer type and which level it's for.
func parseLayerName(name):
	for result in Static.ZoneLayerPattern.search_all(name):
		if result.strings.size() == 3:
			return {
				"type": result.strings[1].to_lower(),
				"index": int(result.strings[2]) - 1 }
	printerr("Unparsable Layer Name: ",name)

func saveAsChunks():
	print("TODO: Save as chunks")
