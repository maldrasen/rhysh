extends Node

var DungeonIndexPattern
var ZoneLayerPattern

# GDScript doesn't allow for static variables, so as a workaround we can keep
# everything that I would have made static in this Singleton instead.
func _ready():
	DungeonIndexPattern = RegEx.new()
	DungeonIndexPattern.compile("\\((-?\\d+),(-?\\d+),(-?\\d+)\\)")

	ZoneLayerPattern = RegEx.new()
	ZoneLayerPattern.compile("(\\w+) (\\d+)")
