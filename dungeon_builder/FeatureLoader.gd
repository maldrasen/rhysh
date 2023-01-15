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

	if featureInfo.has("FeatureSet"):
		MapData.addTemplateToSet(featureInfo["FeatureSet"],featureInfo["Name"])

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
				var tileData = tileDataAt(mapLayer, layerInfo.type, Vector3i(x,y,layerInfo.index))

				if tileData:
					if dataLayers[layerInfo.index][tileIndex] == null:
						dataLayers[layerInfo.index][tileIndex] = {}
					dataLayers[layerInfo.index][tileIndex][layerInfo.type] = tileData

	return dataLayers

# The mapLayer will have its tile data in either a 2D array of string if it's the regions layer, or
# as a 2D array of numbers if it's one of the other layers.
func tileDataAt(mapLayer, layerType, point):
	var extensionLoader = ExtensionLoader.new(featureData)

	# TODO: The features don't fo anything with the region layers. The ZoneLoader uses the regions
	#       to add to the supplementary data used by the biome builders. They could be used for
	#       something else in the features, but I'd either need to figure out where to put
	#		supplementary data when outside of the biome builder, or find a way to include that
	#		data when the feature is loaded (but the build order gets super important, better not
	#		to faff about with all that)
	if mapLayer.has("grid2D"):
		var tileId = mapLayer.grid2D[point.y][point.x]
		if tileId != "0":
			return null

	if mapLayer.has("data2D"):
		var tileId = mapLayer.data2D[point.y][point.x]
		if tileId >= 0:
			return extensionLoader.adjustedLayerData(layerType, tileId, point)