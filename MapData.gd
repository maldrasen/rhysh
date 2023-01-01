extends Node

var rhyshRoot = {}
var rhyshExtra = {}
var rhyshExtended = {}

func _ready():
	parseTilemapFiles()

# === Feature Loading ==============================================================================

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
