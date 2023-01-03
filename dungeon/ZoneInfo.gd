extends Object

class_name ZoneInfo

var name
var origins
var exits
var biomes

# The ZoneInfo class holds information about a zone pulled from the JSON data. This includes where
# the exits are, what zones this connects to, all that. This is all just static data and doesn't
# change over the course of the game so shouldn't need to be persisted.
func _init(name_:String):
	self.name = name_
	self.origins = {}
	self.exits = {}
	self.biomes = {}

# Load the persistant zone data from the JSON map data. This will include the origin points (the
# points that the party location is set to when they enter the zone) and the exits. (points that
# entering into will trigger a transition to another zone.
func buildFromData(zoneData):
	self.biomes = zoneData.biomes

	# Gather origin points.
	for code in zoneData.origins:
		var origin = zoneData.origins[code]
		origins[code] = {
			"index":DungeonIndex.new(int(origin.x), int(origin.y), int(origin.z)),
			"facing":origin.facing }

	# Gather exit points.
	for code in zoneData.exits:
		var exit = zoneData.exits[code]
		var points = []
		for point in exit.points:
			points.push_back(DungeonIndex.new(int(point.x), int(point.y), int(point.z)))

		exits[code] = {
			"visible": exit.visible,
			"points": points }

func _to_string():
	return "ZoneInfo[{0}]".format([name])
