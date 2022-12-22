extends Node
class_name Tile

enum Type { Empty, Solid, StairsUp, StairsDown }

var type
var theFloor
var walls = {
	Constants.North: null,
	Constants.South: null,
	Constants.East: null,
	Constants.West: null,
}

# A map of extensions that may be added to this tile. Could include event or
# battle triggers, traps, treasure, whatever.
var extensions = {}

func _init():
	self.type = Type.Empty

func wallAt(facing):
	return walls[facing]

func placeDoor(direction):
	walls[direction].type = Wall.Type.Door

# ==== Feature Loader ==============================================================================
# Building a tile from a string should really only be done by the feature loader which is getting
# its tile data from JSON files.

func setFloorFromString(floorString:String):
	theFloor = Floor.fromString(floorString)

func setWallsFromString(string:String, certainty:Wall.Certainty):
	for dir in ["N","S","E","W"]:
		if string.contains(dir):
			walls[dir] = Wall.new(Wall.Type.Normal, certainty)

func setExtra(extra):
	if extra.type == "Door":
		return placeDoor(extra.facing.substr(0,1))
	if extra.type == "Arches":
		return # TODO: Implement arches
	printerr("Unknown Extra Error: What do I do with this? ",extra)

func setExtension(extension):
	if extension.contains("Battle:"):
		extensions.battle = extension.substr(7,-1)
		return

	if extension.contains("EventTrigger:"):
		extensions.eventTrigger = extension.substr(13,-1)
		return

	if extension.contains("Statue:"):
		extensions.statue = extension.substr(7,-1)
		return

	if extension.contains("Trap:"):
		extensions.trap = extension.substr(5,-1)
		return

	if extension.contains("Tree:"):
		extensions.tree = extension.substr(5,-1)
		return

	if extension.contains("Treasure:"):
		extensions.treasure = extension.substr(9,-1)
		return

	# If the extension isn't one of the predefined types it needs some other kind of special
	# handling. This function is really only concerned with parsing the tile objects from the JSON
	# so something else can deal with it later, or ignore it completely as in the case of the
	# origin point, which is really just on the map for informational purposes.
	extensions.special = extension

# ==== Persistance =================================================================================

func pack():
	var packedWalls = {}

	for facing in Constants.NSEW:
		if walls[facing] != null:
			packedWalls[facing] = walls[facing].pack()

	return {
		"type": self.type,
		"floor": self.theFloor.pack(),
		"walls": packedWalls
	}

static func unpack(data):
	var tile = Tile.new()
	tile.type = data.type
	tile.theFloor = Floor.unpack(data.floor)

	for facing in data.walls.keys():
		tile.walls[facing] = Wall.unpack(data.walls[facing])

	return tile

# ==== To String ===================================================================================

func _to_string():
	var typeString = {
		Type.Empty: "",
		Type.Solid: ":Solid",
		Type.StairsUp: ":Stairs Up" ,
		Type.StairsDown: ":Stairs Down"
	}[self.type]

	var wallStrings = PackedStringArray([])
	if walls.N:
		wallStrings.append("N:{0}".format([walls.N]))
	if walls.S:
		wallStrings.append("S:{0}".format([walls.S]))
	if walls.E:
		wallStrings.append("E:{0}".format([walls.E]))
	if walls.W:
		wallStrings.append("W:{0}".format([walls.W]))

	var ext = ""
	if self.extensions:
		ext = " Extensions:{0}".format([self.extensions])

	return "Tile{0}[Floor:{1}, Walls:[{2}]{3}]".format([typeString,theFloor," ".join(wallStrings), ext])

func wallString(dir):
	if walls.has(dir):
		return "{0}:{1}".format([dir, walls[dir].type])
	return "-"
