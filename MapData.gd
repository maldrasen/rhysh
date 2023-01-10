extends Node

const FeatureList = [
	"Farms"
]

var rhyshRoot = {}
var rhyshExtra = {}
var rhyshExtended = {}
var featureLibrary = {}
var featureSets = {}

# The FeatureSet names are buried in the feature data files, which actually can't even be opened
# in Godot. (Not sure why it can't even view a JSON file, but whatever) Here is a list of the set
# names:
#          farms
#
# (I mean... I'm going to have more soon.)

func _ready():
	parseTilemapFiles()
	loadFeatures()

# ==== Tilemap Loading =============================================================================

func parseTilemapFiles():
	rhyshRoot = parseTilemap("res://map_data/tilemaps/rhysh-root.json")
	rhyshExtra = parseTilemap("res://map_data/tilemaps/rhysh-extra.json")
	rhyshExtended = parseTilemap("res://map_data/tilemaps/rhysh-extended.json")

# The big gatcha in parsing JSON is that all number types are turned into floats. Took me forever
# to figure that out because the print() function prints 0.0 as 0
func parseTilemap(path):
	var file = FileAccess.open(path, FileAccess.READ)
	var content = JSON.parse_string(file.get_as_text())
	var tileMap = {}

	for tileDefinition in content.tiles:
		tileMap[int(tileDefinition.id)] = tileDefinition

	return tileMap

func randomFeatureFromSet(setName):
	return Feature.new(featureSets[setName].pick_random())

func randomFeatureFromSets(setNames):
	var featureList = []

	for setName in setNames:
		for feature in featureSets[setName]:
			featureList.push_back(feature)

	return Feature.new(featureList.pick_random())

func lookup(type:String, id:int):
	if type.to_lower() == "root":
		if rhyshRoot.has(id):
			return rhyshRoot[id]
	if type.to_lower() == "extra":
		if rhyshExtra.has(id):
			return rhyshExtra[id]
	if type.to_lower() == "extended":
		if rhyshExtended.has(id):
			return rhyshExtended[id]
	printerr("Error: No MapData for {0}:{1}".format([type,id]))

# ==== Feature Loading =============================================================================

func loadFeatures():
	print("=== Loading Feature Library ===")
	for feature in FeatureList:
		FeatureLoader.new(feature).loadFeatures()
	print("Loaded {0} features".format([featureLibrary.size()]))

# Called by the FeatureLoaders for each feature they load.
func addTemplateToLibrary(template):
	featureLibrary[template.name] = template

# Features also can belong to a feature set. These are used to select random features when building
# the dungeon. Biomes can draw features from many sets and sets may belong to many biomes.
func addTemplateToSet(setName, templateName):
	if featureSets.has(setName) == false:
		featureSets[setName] = []
	featureSets[setName].push_back(templateName)

func lookupFeatureTemplate(templateName):
	return featureLibrary[templateName]

# ==== Map Data Files ==============================================================================

static func loadZoneMap(name):
	return loadMap("zones",name)

static func loadZoneData(name):
	return loadData("zones",name)

static func loadFeatureMap(name):
	return loadMap("features",name)

static func loadFeatureData(name):
	return loadData("features",name)

static func loadMap(mapType, mapName):
	var mapPath = "res://map_data/{0}/{1}.json".format([mapType,mapName])
	var mapFile = FileAccess.open(mapPath, FileAccess.READ)

	if mapFile == null:
		return printerr("Error: No file at {1}".format([mapPath]))

	var map = JSON.parse_string(mapFile.get_as_text())
	if map == null:
		return printerr("Parsing Error, cannot read {0}".format([mapPath]))

	return map

static func loadData(mapType, mapName):
	var dataPath = "res://map_data/{0}/{1}Data.json".format([mapType,mapName])
	var dataFile = FileAccess.open(dataPath, FileAccess.READ)

	if dataFile == null:
		return printerr("Error: No file at {1}".format([dataPath]))

	var zoneData = JSON.parse_string(dataFile.get_as_text())
	if zoneData == null:
		return printerr("Parsing Error, cannot read {0}".format([dataPath]))

	return zoneData

# We use the layer's name to determine the layer type and which level it's for.
static func parseLayerName(name):
	for result in Static.MapLayerPattern.search_all(name):
		if result.strings.size() == 3:
			return {
				"type": result.strings[1].to_lower(),
				"index": int(result.strings[2]) - 1 }
	printerr("Unparsable Layer Name: ",name)
