extends Node

class_name ZoneData

static func loadZoneMap(name):
	var mapPath = "res://map_data/zones/{0}.json".format([name])
	var mapFile = FileAccess.open(mapPath, FileAccess.READ)

	if mapFile == null:
		return printerr("Error creating Zone({0}). No map file named {1}".format([name,mapPath]))

	var zoneMap = JSON.parse_string(mapFile.get_as_text())
	if zoneMap == null:
		return printerr("Parsing Error, cannot read {0}".format([mapPath]))

	return zoneMap

static func loadZoneData(name):
	var dataPath = "res://map_data/zones/{0}Data.json".format([name])
	var dataFile = FileAccess.open(dataPath, FileAccess.READ)

	if dataFile == null:
		return printerr("Error creating Zone({0}). No map data file named {1}".format([name,dataFile]))

	var zoneData = JSON.parse_string(dataFile.get_as_text())
	if zoneData == null:
		return printerr("Parsing Error, cannot read {0}".format([dataPath]))

	return zoneData

# We use the layer's name to determine the layer type and which level it's for.
static func parseLayerName(name):
	for result in Static.ZoneLayerPattern.search_all(name):
		if result.strings.size() == 3:
			return {
				"type": result.strings[1].to_lower(),
				"index": int(result.strings[2]) - 1 }
	printerr("Unparsable Layer Name: ",name)
