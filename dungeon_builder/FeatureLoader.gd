extends Node

var rhyshTilemap = {}
var rhyshExtra = {}
var rhyshExtended = {}

func _ready():
	parseTilemapFiles()
	loadFeatures()

func parseTilemapFiles():
	rhyshTilemap = parseTilemap("res://data/tilemaps/rhysh-tilemap.json")
	rhyshExtra = parseTilemap("res://data/tilemaps/rhysh-extra.json")
	rhyshExtended = parseTilemap("res://data/tilemaps/rhysh-extended.json")
		
# The big gatcha in parsing JSON is that all number types are turned into floats. Took me forever
# to figure that out because the print() function prints 0.0 as 0
func parseTilemap(path):
	var file = FileAccess.open(path, FileAccess.READ)
	var content = JSON.parse_string(file.get_as_text())
	var tileMap = {}
	
	for tileDefinition in content.tiles:
		var tile = {}
		for property in tileDefinition.properties:
			tile[property.name] = property.value
		tileMap[tileDefinition.id as int] = tile

	return tileMap

func loadFeatures():
	var folder = DirAccess.open("res://data/features")
	for filename in folder.get_files():
		var file = FileAccess.open("res://data/features/{0}".format([filename]), FileAccess.READ)
		loadFeature(filename, JSON.parse_string(file.get_as_text()))

# Building a feature from a Tiled JSON document is going to be pretty fragile. I immagine that this
# will break quite a bit as we refine the way that we're building the features in the editor. I'll
# probably have to tweek this function, then reexport all of the maps a few times as the format
# evolves. Right now these features are all only a single floor. We'll eventually need a way to 
# indicate that a feature spans multiple floors. Perhaps by setting some properties in the map that
# specify where the bounds of the floors should be. 
func loadFeature(filename, document):
	var propertyMap = {}
	var featureWidth = 0;
	var featureHeight = 0;

	var rootOffset = 0;
	var extraOffset = 0;
	var extendedOffset = 0;
	
	var rootData
	var extraData
	var extendedData

	print("Loading tilemap",filename)

	# We keep a mapping of the symbol type from the tileset to an acual use for that tile in the 
	# map properties. These could be things like event triggers and may contain the actual event 
	# codes and such. Could also be something to be randomized like a trap or a chest.
	for property in document.properties:
		propertyMap[property.name] = property.value

	# The int values in the data arrays are offset by a number depending on which tileset they 
	# come from. This could get stupid complicated I think, so I'll just use the same tileset in
	# each layer, but I still need to know the offset being used to look the tile up in the 
	# associated tilemap
	for tileset in document.tilesets:
		if tileset.source.contains("rhysh-tilemap"):
			rootOffset = (tileset.firstgid as int)
			print("Offset 1 - ",rootOffset)
		if tileset.source.contains("rhysh-extra"):
			extraOffset = (tileset.firstgid as int)
			print("Offset 2 - ",extraOffset)
		if tileset.source.contains("kenny-bw-small"):
			extendedOffset = (tileset.firstgid as int)
			print("Offset 3 - ",extendedOffset)
	
	# Different layers in the feature maps use different tilesets and set different properties in
	# the tiles. I can set the layer name in the editor and use that to select which tilemap I use
	# here, but that's a connection that will probably break if I don't name things the same in
	# every map. Could possible add more tilemap types as well.
	#    Name "Root"  -> rhyshTilemap
	#    Name "Extra" -> rhyshExtra
	for layer in document.layers:
		if layer.name == "Root":
			rootData = layer.data
		if layer.name == "Extra":
			extraData = layer.data
		if layer.name == "Extended":
			extendedData = layer.data
	
	# Finally we have all the data in the format that we need. So now we create a tile for each 
	# entry in the data array. This will also break if we use anything other than a 32x32 map.
	for y in 32:
		for x in 32:
			var index = x + (y*32)
			var rootIndex = (rootData[index] as int) - rootOffset
			var extraIndex = (extraData[index] as int) - extraOffset
			var extendedIndex = (extendedData[index] as int) - extendedOffset

			if rootIndex > 0:
				var rootValue = rhyshTilemap.get(rootIndex)
				var extraValue = rhyshExtra.get(extraIndex) 
				var extendedValue = rhyshExtended.get(extendedIndex) 
				var extension = null
				
				# An extended value can map to any kind of extension value. It's up to the builder
				# of that feature to know what an extension does.
				if extendedValue:
					if propertyMap.has(extendedValue.type):
						extension = propertyMap.get(extendedValue.type)
					else:
						printerr("Error: Extended has value:",extendedValue," that wasn't mapped to any extension.")
				
				# As we loop though the data array we keep track of the largest x and y and use
				# those values to set the size of the feature.
				if featureHeight < y:
					featureHeight = y
				if featureWidth < x:
					featureWidth = x
				
				# TODO: Build the tile and add it to location x,y in the feature's tile map
				if rootValue.has("region"):
					defineRegion(x,y,rootValue.region)
				else:
					var tileData = { "x":x,"y":y,"root":rootValue }
					if extraValue:
						tileData.extra = extraValue
					if extension:
						tileData.extension = extension
					buildTile(tileData)

# These functions need to be on the feature, not the loader.
func defineRegion(x,y,region):
	print("Add ({0},{1}) to region {2}".format([x,y,region]))

func buildTile(tileData):
	print("Build Tile:",tileData)
		
