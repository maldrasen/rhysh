extends Object

class_name FeatureLoader

var featureMap
var featureData
var featureTemplates

func _init(filename):
	self.featureMap = MapData.loadFeatureMap(filename)
	self.featureData = MapData.loadFeatureData(filename)
	self.featureTemplates = {}

func loadFeatures():
	for featureInfo in featureData["Features"]:
		loadFeature(featureInfo)

func loadFeature(featureInfo):
	print("  Load Feature({0})".format([featureInfo["Name"]]))
	print("    Feature Info > ",featureInfo)

	var tileData = loadTileData(featureInfo)
	var featureTemplate = FeatureTemplate.new(featureInfo)

	for layerIndex in tileData.size():
		var layer = tileData[layerIndex]
		print("    Layer[{0}]".format([layerIndex]))
		print("    ",layer)




# Though the features have to do the same kind of map parsing as the zones, the way these layers
# are loaded is completely different.
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









#	var featureType
#	var featureName
#	var properties = {}
#	var offsets = {}
#	var layers = {}

	# We keep a mapping of the symbol type from the tileset to an acual use for that tile in the
	# map properties. These could be things like event triggers and may contain the actual event
	# codes and such. Could also be something to be randomized like a trap or a chest.
#	for property in document.properties:
#		if property.name == "FeatureName":
#			featureName = property.value
#		elif property.name == "FeatureType":
#			featureType = property.value
#		else:
#			properties[property.name] = property.value
#
#	if featureType == null:
#		return printerr("A feature needs a FeatureType property.")
#	if featureName == null:
#		return printerr("A feature needs a FeatureName property.")
#
#	# The int values in the data arrays are offset by a number depending on which tileset they
#	# come from. This could get stupid complicated I think, so I'll just use the same tileset in
#	# each layer, but I still need to know the offset being used to look the tile up in the
#	# associated tilemap
#	for tileset in document.tilesets:
#		if tileset.source.contains("rhysh-tilemap"):
#			offsets.root = (tileset.firstgid as int)
#		if tileset.source.contains("rhysh-extra"):
#			offsets.extra = (tileset.firstgid as int)
#		if tileset.source.contains("rhysh-extended"):
#			offsets.extended = (tileset.firstgid as int)
#
#	# Different layers in the feature maps use different tilesets and set different properties in
#	# the tiles. I can set the layer name in the editor and use that to select which tilemap I use
#	# here, but that's a connection that will probably break if I don't name things the same in
#	# every map. Could possible add more tilemap types as well.
#	#    Name "Root"  -> rhyshTilemap
#	#    Name "Extra" -> rhyshExtra
#	for layer in document.layers:
#		if layer.name == "Root":
#			layers.root = layer.data
#		if layer.name == "Extra":
#			layers.extra = layer.data
#		if layer.name == "Extended":
#			layers.extended = layer.data
#
#	var package = {
#		"featureType": featureType,
#		"featureName": featureName,
#		"properties": properties,
#		"offsets": offsets,
#		"layers": layers }
#
#	print("  Loading {0} [{1}]".format([featureName, featureType]))
#
#	if featureType == "PrefabChunk":
#		loadPrefabChunk(package)
#
#	if featureType == "FeatureMap":
#		loadFeatureMap(filename, package)


# The PrefabChunk represents an entire chunk of tiles, so we create a single feature with a
# tile for each entry in the data arrays.
#func loadPrefabChunk(package):
#	var loader = FeatureLoader.new(package)
#	for y in Constants.ChunkSize:
#		for x in Constants.ChunkSize:
#			loader.loadTile(x,y)
#	features[package.featureName] = loader.feature

# A FeatureMap has many features packaged into one tilemap file. To unpack them we iterate through
# the feature data file, creating a feature for each.
#func loadFeatureMap(filename, package):
#	var loader
#
#	for featureData in loadFeatureMapData(filename).Features:
##		loader = FeatureLoader.new(package)
#		loader.setFeatureData(featureData)
#
#		for x in range(featureData.X, featureData.X + featureData.Width):
#			for y in range(featureData.Y, featureData.Y + featureData.Height):
#				loader.loadTile(x,y)
#
#		var feature = loader.feature
#		feature.reorientTiles(-Vector2(featureData.X, featureData.Y))
#		features[feature.featureName] = feature
#
#		if featureData.has("FeatureSets"):
#			addFeatureToSets(featureData.FeatureSets, feature.featureName)

# Just to make this work by convention, if a feature needs a suplementary data, it'll be under the
# same filename but in the feature_data directory.
#func loadFeatureMapData(filename):
#	var file = FileAccess.open("res://data/feature_data/{0}".format([filename]), FileAccess.READ)
#	return JSON.parse_string(file.get_as_text())

# Features also can belong to a feature set. These are used to select random features when building
# the dungeon. Biomes can draw features from many sets and sets may belong to many biomes.
#func addFeatureToSets(setList, featureName):
#	for setName in setList:
#		if false == featureSets.has(setName):
#			featureSets[setName] = []
#		featureSets[setName].push_back(featureName)



# ==== Old Feature Loader as Well ==================================================================

#var feature
#var properties
#var offsets
#var layers

#func _init(package):
#	properties = package.properties
#	offsets = package.offsets
#	layers = package.layers
#	feature = FeatureTemplate.new()
#	feature.size = Vector3i(Constants.ChunkSize, Constants.ChunkSize, 1)
#
#func setFeatureData(featureData):
#	feature.featureType = featureData.Type
#	feature.featureName = featureData.Name
#	feature.regionType = featureData.RegionType
#	feature.canFlip = featureData.Flip
#	feature.size = Vector3i(featureData.Width, featureData.Height, 1)
#
#func loadTile(x,y):
#	var index = x + (y*Constants.ChunkSize)
#	var rootIndex = (layers.root[index] as int) - offsets.root
#	var extraIndex
#	var extendedIndex
#
#	if offsets.has("extra"):
#		extraIndex = (layers.extra[index] as int) - offsets.extra
#	if offsets.has("extended"):
#		extendedIndex = (layers.extended[index] as int) - offsets.extended

# TODO: Changing Feature Template Format

#	if rootIndex >= 0:
#		var rootValue = FeatureLibrary.rhyshTilemap.get(rootIndex)
#		var tileData = { "x":x,"y":y,"root":rootValue }
#
#		if rootValue == null:
#			return
#
#		if offsets.has("extra") and FeatureLibrary.rhyshExtra.has(extraIndex):
#			tileData.extra = FeatureLibrary.rhyshExtra.get(extraIndex)
#
#		# An extended value can map to any kind of extension value. It's up to the builder
#		# of that feature to know what an extension does.
#		if offsets.has("extended") and FeatureLibrary.rhyshExtended.has(extendedIndex):
#			var extension = properties.get(FeatureLibrary.rhyshExtended.get(extendedIndex).type)
#			if extension == null:
#				printerr("=== Cannot Build Feature: ",feature.featureName," ===")
#				printerr("There is no mapped extension for ",FeatureLibrary.rhyshExtended.get(extendedIndex).type)
#				printerr("Extended index:{0} found at ({1},{2})".format([extendedIndex,x,y]))
#				return
#			tileData.extension = extension
#
#		if rootValue.has("Biome"):
#			var biomeKey = "Biome-{0}".format([rootValue.Biome])
#			var biomeName = properties.get(biomeKey)
#			if biomeName == null:
#				printerr("=== Cannot Build Feature: ",feature.featureName," ===")
#				printerr("The root node referenced a biome (",biomeKey,") that wasn't found in the property map.")
#				printerr("Found at root index:{0} ({1},{2})".format([rootIndex,x,y]))
#				return
#
#			# TODO: Biome Manager is getting completely redone.
#			#feature.defineBiomeArea(x,y,BiomeManager.biomeFromString(biomeName))
#			return
#
#		feature.buildTile(tileData)
