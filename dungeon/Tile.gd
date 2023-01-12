extends Object
class_name Tile

enum Type { Empty, Solid, StairsUp, StairsDown }

var type:Type
var sector
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

func isEmpty():
	return self.type == Type.Empty

func isSolid():
	return self.type == Type.Solid

func hasFloor():
	return self.theFloor != null && self.theFloor.isNormal()

func wallAt(facing):
	return walls[facing]

func placeWall(direction, certainty=Wall.Certainty.Tentative):
	walls[direction] = Wall.new(Wall.Type.Normal, certainty)

func placeDoor(direction, certainty=Wall.Certainty.High):
	walls[direction] = Wall.new(Wall.Type.Door, certainty)

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


# ==== Tile Loading ================================================================================
# We create tiles from tile data when loading them from the JSON map data. The tile data should be
# the same across map type. For example, a tile with both extra and extended data:
#    { "root":     { "id": 20, "tile": "Empty", "floor": "Normal", "walls": "W" },
#      "extra":    { "id": 0,  "type": "Door", "doors": "W" },
#      "extended": { "id": 58, "type": "Point", "value": "Green" }}

static func fromTileData(tileData) -> Tile:
	var tile = Tile.new()

	if tileData.has("root") == false:
		printerr("No root in: ",tileData)

	if tileData.has("root"):
		if tileData.root.has("walls"):
			tile.setWallsFromString(tileData.root.walls, Wall.Certainty.Tentative)
		if tileData.root.has("floor"):
			tile.setFloorFromString(tileData.root.floor)
		if tileData.has("extra"):
			tile.setExtra(tileData.extra)
		if tileData.has("extended"):
			tile.setExtensions(tileData.extended)
		if tileData.root.tile == "Solid":
			tile.fillWith(tileData.root.fill)

	if tile.theFloor == null:
		tile.theFloor = Floor.new(Floor.Type.Void)

	return tile

func setFloorFromString(floorString:String):
	theFloor = Floor.fromString(floorString)

func setWallsFromString(string:String, certainty:Wall.Certainty):
	for dir in Constants.NSEW:
		if string.contains(dir):
			walls[dir] = Wall.new(Wall.Type.Normal, certainty)

func setFences(extra):
	for dir in Constants.NSEW:
		if extra.facing.contains(dir):
			if walls[dir] != null:
				print("Error: Trying to set a fence where a wall has already been placed.")
			else:
				walls[dir] = Wall.new(Wall.Type.Fence, Wall.Certainty.High)


func setExtra(extra):

	if extra.type == "Stairs":
		if extra.stairs == "Down":
			self.type = Type.StairsDown
		if extra.stairs == "Up":
			self.type = Type.StairsUp
		return

	if extra.type == "Door":
		for dir in Constants.NSEW:
			if extra.facing.contains(dir):
				placeDoor(dir)
		return

	if extra.type == "Fence":
		return setFences(extra)

	if extra.type == "SecretDoor":
		return # TODO: Implement secret doors
	if extra.type == "TrappedDoor":
		return # TODO: Implement trapped doors
	if extra.type == "FenceGate":
		return # TODO: Implement fences
	if extra.type == "Pillar":
		return # TODO: Implement pillars
	if extra.type == "Gateway":
		return # TODO: Implement transitions

	printerr("Unknown Extra Error: What do I do with this? ",extra)

func setExtensions(extension):
	if extension.type == "Tree":
		return fillWithTree()
	if extension.type == "Statue":
		return fillWithStatue(extension.value)
	if extension.type == "Bridge":
		return #TODO: Implement bridges
	if extension.type == "Sign":
		return #TODO: Implement signs
	if extension.type == "Trigger":
		return #TODO: Implement triggers

	print("Unknown Extension Error: What do I do with this?",extension)

func fillWith(fillName):
	self.type = Type.Solid
	self.fill = {
		"Stone": { "stone":"normal" }
	}[fillName]

func fillWithTree(treeType = "random"):
	self.type = Type.Solid
	self.fill = { "tree":treeType }

func fillWithStatue(statueType = "random"):
	self.type = Type.Solid
	self.fill = { "statue":statueType }

# ==== Persistance =================================================================================

func pack():
	var packedWalls = {}

	for facing in Constants.NSEW:
		if walls[facing] != null:
			packedWalls[facing] = walls[facing].pack()

	return {
		"type": self.type,
		"sector": self.sector,
		"biome": self.biome,
		"floor": self.theFloor.pack(),
		"fill": self.fill,
		"extensions": self.extensions,
		"walls": packedWalls
	}

static func unpack(data):
	var tile = Tile.new()
	tile.type = data.type
	tile.sector = data.sector
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
