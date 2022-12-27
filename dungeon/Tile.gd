extends Object
class_name Tile

enum Type { Empty, Solid, StairsUp, StairsDown }

var type:Type
var region
var biome
var theFloor
var walls = {
	Constants.North: null,
	Constants.South: null,
	Constants.East: null,
	Constants.West: null,
}

# If a tile is solid we need to know what it's filled with in order to properly render it. It
# should be map of fill-type to fill-value. Types I know about so far are:
#   { statue: "type" }
#   { stone: "type" }
#   { tree: "type" }
#
# If no fill is specified and we have a solid tile, assume it's filled with stone.
var fill

# A map of extensions that may be added to this tile. Could include event or
# battle triggers, traps, treasure, whatever.
var extensions = {}

static func normal():
	var tile = Tile.new()
	tile.theFloor = Floor.new(Floor.Type.Normal)
	return tile

func _init():
	self.type = Type.Empty

func wallAt(facing):
	return walls[facing]

func placeDoor(direction):
	walls[direction].type = Wall.Type.Door

# ==== Flipping ====================================================================================

func flipH():
	var temp = walls.E
	walls.E = walls.W
	walls.W = temp

func flipV():
	var temp = walls.N
	walls.N = walls.S
	walls.S = temp

func flipD():
	self.walls = {
		"N": self.walls.E,
		"S": self.walls.W,
		"E": self.walls.N,
		"W": self.walls.S }


# ==== Feature Loader ==============================================================================
# Building a tile from a string should really only be done by the feature loader which is getting
# its tile data from JSON files.

func setFloorFromString(floorString:String):
	theFloor = Floor.fromString(floorString)

func setWallsFromString(string:String, certainty:Wall.Certainty):
	for dir in Constants.NSEW:
		if string.contains(dir):
			walls[dir] = Wall.new(Wall.Type.Normal, certainty)

func setExtra(extra):
	if extra.type == "Door":
		for dir in Constants.NSEW:
			if extra.facing.contains(dir):
				placeDoor(dir)
		return

	if extra.type == "SecretDoor":
		return # TODO: Implement secret doors

	if extra.type == "Gate":
		return # TODO: Implement gates and columns

	printerr("Unknown Extra Error: What do I do with this? ",extra)

func setExtension(extension):
	if extension.contains("Battle:"):
		extensions.battle = extension.substr(7,-1)
		return

	if extension.contains("EventTrigger:"):
		extensions.eventTrigger = extension.substr(13,-1)
		return

	# TODO: The value of the statue extension should point to some kind of statue model. This is
	#       fine for the map, but eventually we need to turn whatever string reference this is into
	#       something more concrete.
	if extension.contains("Statue:"):
		self.type = Type.Solid
		self.fill = { "statue":extension.substr(7,-1) }
		return

	if extension.contains("Trap:"):
		extensions.trap = extension.substr(5,-1)
		return

	# TODO: This is just setting the fill value to something like {tree:random} but really we need
	#       to select a random tree here and place it in the fill. We don't have any of those right
	#       now, and this is only used to draw a green square on the map now.
	if extension.contains("Tree:"):
		self.type = Type.Solid
		self.fill = { "tree":extension.substr(5,-1) }
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
		"region": self.region,
		"biome": self.biome,
		"floor": self.theFloor.pack(),
		"fill": self.fill,
		"extensions": self.extensions,
		"walls": packedWalls
	}

static func unpack(data):
	var tile = Tile.new()
	tile.type = data.type
	tile.region = data.region
	tile.biome = data.biome
	tile.theFloor = Floor.unpack(data.floor)
	tile.fill = data.fill
	tile.extensions = data.extensions

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
