extends Node

class_name FeatureLoader

var feature
var properties
var offsets
var layers

func _init(package):
	properties = package.properties
	offsets = package.offsets
	layers = package.layers
	feature = FeatureTemplate.new()
	feature.size = Vector3i(Constants.ChunkSize, Constants.ChunkSize, 1)

func setFeatureData(featureData):
	feature.featureType = featureData.Type
	feature.featureName = featureData.Name
	feature.canFlip = featureData.Flip
	feature.size = Vector3i(featureData.Width, featureData.Height, 1)

func loadTile(x,y):
	var index = x + (y*Constants.ChunkSize)
	var rootIndex = (layers.root[index] as int) - offsets.root
	var extraIndex
	var extendedIndex

	if offsets.has("extra"):
		extraIndex = (layers.extra[index] as int) - offsets.extra
	if offsets.has("extended"):
		extendedIndex = (layers.extended[index] as int) - offsets.extended

	if rootIndex >= 0:
		var rootValue = FeatureLibrary.rhyshTilemap.get(rootIndex)
		var tileData = { "x":x,"y":y,"root":rootValue }

		if rootValue == null:
			return

		if offsets.has("extra") and FeatureLibrary.rhyshExtra.has(extraIndex):
			tileData.extra = FeatureLibrary.rhyshExtra.get(extraIndex)

		# An extended value can map to any kind of extension value. It's up to the builder
		# of that feature to know what an extension does.
		if offsets.has("extended") and FeatureLibrary.rhyshExtended.has(extendedIndex):
			var extension = properties.get(FeatureLibrary.rhyshExtended.get(extendedIndex).type)
			if extension == null:
				printerr("=== Cannot Build Feature: ",feature.featureName," ===")
				printerr("There is no mapped extension for ",FeatureLibrary.rhyshExtended.get(extendedIndex).type)
				printerr("Extended index:{0} found at ({1},{2})".format([extendedIndex,x,y]))
				return
			tileData.extension = extension

		if rootValue.has("Biome"):
			var biomeKey = "Biome-{0}".format([rootValue.Biome])
			var biomeName = properties.get(biomeKey)
			if biomeName == null:
				printerr("=== Cannot Build Feature: ",feature.featureName," ===")
				printerr("The root node referenced a biome (",biomeKey,") that wasn't found in the property map.")
				printerr("Found at root index:{0} ({1},{2})".format([rootIndex,x,y]))
				return
			feature.defineBiomeArea(x,y,BiomeManager.biomeFromString(biomeName))
			return

		feature.buildTile(tileData)
