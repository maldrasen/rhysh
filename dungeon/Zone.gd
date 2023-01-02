extends Object

class_name Zone

var name
var origins
var exits

func _init(name_:String):
	self.name = name_
	self.origins = {}
	self.exits = {}

# Load the persistant zone data from the JSON map data. This will include the origin points (the
# points that the party location is set to when they enter the zone) and the exits. (points that
# entering into will trigger a transition to another zone.
func buildFromData(zoneData):

	# Gather origin points.
	for code in zoneData.origins:
		var origin = zoneData.origins[code]
		origins[code] = {
			"index":DungeonIndex.new(int(origin.x), int(origin.y), int(origin.z)),
			"facing":origin.facing }

	# Gather exit points.
	for code in zoneData.exits:
		var points = []
		for point in zoneData.exits[code]:
			points.push_back(DungeonIndex.new(int(point.x), int(point.y), int(point.z)))
		exits[code] = { "points":points }

func _to_string():
	return "Zone[{0}]".format([name])
