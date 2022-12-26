extends Node

class_name PrefabChunkBuilder

static func build(package):
	var feature = FeatureTemplate.new()
	var properties = package.properties
	var offsets = package.offsets
	var layers = package.layers

	# The PrefabChunk represents an entire chunk of tiles, so we create a single feature with a
	# tile for each entry in the data arrays.
	for y in Constants.ChunkSize:
		for x in Constants.ChunkSize:
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
					continue

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

				# As we loop though the data array we keep track of the largest x and y and use
				# those values to set the size of the feature.
				if feature.size.y < y:
					feature.size.y = y
				if feature.size.x < x:
					feature.size.x = x

				if rootValue.has("Biome"):
					var biomeKey = "Biome-{0}".format([rootValue.Biome])
					var biomeName = properties.get(biomeKey)
					if biomeName == null:
						printerr("=== Cannot Build Feature: ",feature.featureName," ===")
						printerr("The root node referenced a biome (",biomeKey,") that wasn't found in the property map.")
						printerr("Found at root index:{0} ({1},{2})".format([rootIndex,x,y]))
						return
					feature.defineBiomeArea(x,y,BiomeManager.biomeFromString(biomeName))
					continue

				feature.buildTile(tileData)

	# Optional brackets would be nice.
	return feature
