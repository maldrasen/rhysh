extends Node

var rhyshTilemap = {}
var rhyshExtra = {}
var rhyshExtended = {}
var features = {}

func _ready():
	parseTilemapFiles()
	loadFeatures()

func lookup(id):
	return features.get(id)

# === Feature Loading ==============================================================================

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
	print("=== Loading Feature Library ===")
	var folder = DirAccess.open("res://data/features")
	for filename in folder.get_files():
		var file = FileAccess.open("res://data/features/{0}".format([filename]), FileAccess.READ)
		loadFeature(JSON.parse_string(file.get_as_text()))

# Building a feature from a Tiled JSON document is going to be pretty fragile. I immagine that this
# will break quite a bit as we refine the way that we're building the features in the editor. I'll
# probably have to tweek this function, then reexport all of the maps a few times as the format
# evolves. Right now these features are all only a single floor. We'll eventually need a way to
# indicate that a feature spans multiple floors. Perhaps by setting some properties in the map that
# specify where the bounds of the floors should be.
func loadFeature(document):
	var featureType
	var featureName
	var properties = {}
	var offsets = {}
	var layers = {}

	# We keep a mapping of the symbol type from the tileset to an acual use for that tile in the
	# map properties. These could be things like event triggers and may contain the actual event
	# codes and such. Could also be something to be randomized like a trap or a chest.
	for property in document.properties:
		if property.name == "FeatureName":
			featureName = property.value
		elif property.name == "FeatureType":
			featureType = property.value
		else:
			properties[property.name] = property.value

	if featureType == null:
		return printerr("A feature needs a FeatureType property.")
	if featureName == null:
		return printerr("A feature needs a FeatureName property.")

	# The int values in the data arrays are offset by a number depending on which tileset they
	# come from. This could get stupid complicated I think, so I'll just use the same tileset in
	# each layer, but I still need to know the offset being used to look the tile up in the
	# associated tilemap
	for tileset in document.tilesets:
		if tileset.source.contains("rhysh-tilemap"):
			offsets.root = (tileset.firstgid as int)
		if tileset.source.contains("rhysh-extra"):
			offsets.extra = (tileset.firstgid as int)
		if tileset.source.contains("rhysh-extended"):
			offsets.extended = (tileset.firstgid as int)

	# Different layers in the feature maps use different tilesets and set different properties in
	# the tiles. I can set the layer name in the editor and use that to select which tilemap I use
	# here, but that's a connection that will probably break if I don't name things the same in
	# every map. Could possible add more tilemap types as well.
	#    Name "Root"  -> rhyshTilemap
	#    Name "Extra" -> rhyshExtra
	for layer in document.layers:
		if layer.name == "Root":
			layers.root = layer.data
		if layer.name == "Extra":
			layers.extra = layer.data
		if layer.name == "Extended":
			layers.extended = layer.data

	var package = {
		"featureType": featureType,
		"featureName": featureName,
		"properties": properties,
		"offsets": offsets,
		"layers": layers }

	print("  Loading {0} [{1}]".format([featureName, featureType]))

	if featureType == "PrefabChunk":
		features[featureName] = PrefabChunkBuilder.build(package)
