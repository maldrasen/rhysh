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
