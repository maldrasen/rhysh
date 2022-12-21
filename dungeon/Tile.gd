extends Node
class_name Tile

enum Type { Empty, Solid, StairsUp, StairsDown }

var type
var floor
var walls = {
	"N": null,
	"S": null,
	"E": null,
	"W": null,
}

# A map of extensions that may be added to this tile. Could include event or 
# battle triggers, traps, treasure, whatever.
var extensions = {}


func _init():
	self.type = Type.Empty

func placeDoor(direction):
	walls[direction].type = Wall.Type.Door

# === Feature Loader ===========================================================
# Building a tile from a string should really only be done by the feature 
# loader which is getting its tile data from JSON files. 

func setFloorFromString(floorString:String):
	floor = Floor.fromString(floorString)
# 
func setWallsFromString(wallString:String, certainty:Wall.Certainty):
	for dir in ["N","S","E","W"]:
		if wallString.contains(dir):
			walls[dir] = Wall.new(Wall.Type.Normal, certainty)

func setExtra(extra):
	if extra.type == "Door":
		return placeDoor(extra.facing.substr(0,1))
	printerr("Unknown Extra Error: What do I do with this? ",extra)

func setExtension(extension):
	if extension.contains("Battle:"):
		extensions.battle = extension.substr(7,-1)
		return

	if extension.contains("EventTrigger:"):
		extensions.eventTrigger = extension.substr(13,-1)
		return

	if extension.contains("Trap:"):
		extensions.trap = extension.substr(5,-1)
		return

	if extension.contains("Treasure:"):
		extensions.treasure = extension.substr(9,-1)
		return

	if extension == "OriginPoint":
		return # Not sure if I actually want this set from a feature.

	if extension == "ReturnToTown":
		return # Not sure how this will be implemented.

	printerr("Unknown Extension Error: What do I do with this? ",extension)

# === To String ================================================================

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
	
	return "Tile{0}[Floor:{1}, Walls:[{2}]{3}]".format([typeString,floor," ".join(wallStrings), ext])

func wallString(dir):
	if walls.has(dir):
		return "{0}:{1}".format([dir, walls[dir].type])
	return "-"

	

