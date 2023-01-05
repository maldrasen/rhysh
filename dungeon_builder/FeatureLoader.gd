extends Object

class_name FeatureLoader

var featureMap
var featureData

func _init(filename):
	self.featureMap = MapData.loadFeatureMap(filename)
	self.featureData = MapData.loadFeatureData(filename)

func loadFeatures():
	for featureInfo in featureData["Features"]:
		loadFeature(featureInfo)

func loadFeature(featureInfo):
	var tileData = loadTileData(featureInfo)
	var featureTemplate = FeatureTemplate.new(featureInfo)

	if featureInfo.has("FeatureSets"):
		MapData.addTemplateToSets(featureInfo["FeatureSets"],featureInfo["Name"])

	for layerIndex in tileData.size():
		var layer = tileData[layerIndex]
		for y in featureInfo["Height"]:
			for x in featureInfo["Width"]:
				var tileIndex = x + (y * featureInfo["Width"])
				if layer[tileIndex]:
					featureTemplate.setTile(Vector3i(x,y,layerIndex), Tile.fromTileData(layer[tileIndex]))

	MapData.addTemplateToLibrary(featureTemplate)

# Though the features have to do the same kind of map parsing as the zones, the way these layers
# are loaded is completely different. A feature map can contain many individual features, and can
# be of any size, probably up to the chunk size though there's really no hard limit.
func loadTileData(featureInfo):
	var dataLayers = []

	for i in featureInfo["Depth"]:
		var layer = []
		layer.resize(featureInfo["Width"] * featureInfo["Height"])
		dataLayers.push_back(layer)

	for mapLayer in self.featureMap.layers:
		var layerInfo = MapData.parseLayerName(mapLayer.name)

		for y in range(featureInfo["Y"], featureInfo["Height"]+featureInfo["Y"]):
			for x in range(featureInfo["X"], featureInfo["Width"]+featureInfo["X"]):
				var tileIndex = x-featureInfo["X"] + ((y-featureInfo["Y"]) * featureInfo["Width"])
				var tileData = tileDataAt(mapLayer, layerInfo.type, Vector2i(x,y))

				if tileData:
					if dataLayers[layerInfo.index][tileIndex] == null:
						dataLayers[layerInfo.index][tileIndex] = {}
					dataLayers[layerInfo.index][tileIndex][layerInfo.type] = tileData

	return dataLayers

# The mapLayer will have its tile data in either a 2D array of string if it's the regions layer, or
# as a 2D array of numbers if it's one of the other layers.
func tileDataAt(mapLayer, layerType, point):

	if mapLayer.has("grid2D"):
		var tileId = mapLayer.grid2D[point.y][point.x]
		if tileId != "0":
			return null # TODO: Implement regions in features maybe?

	if mapLayer.has("data2D"):
		var tileId = mapLayer.data2D[point.y][point.x]
		if tileId >= 0:
			return MapData.lookup(layerType, tileId)
