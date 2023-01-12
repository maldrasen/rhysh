extends Object

class_name Bulldozer

var biomeBuilder
var tileSource
var startPoint
var defaultTile
var directionMap

# We sometimes need to be absolutely sure that a certain point on the map is accessable. Normally
# this is taken care of by the secton connector, but some biome builders won't be using that. This
# is a bit of a blunt force solution to that problem that carves a tunnel from the point we need to
# connect to, to the first empty tile.
func _init(properties):
	var p = properties.startPoint

	self.biomeBuilder = properties.biomeBuilder
	self.tileSource = properties.tileSource
	self.startPoint = DungeonIndex.new(p.x, p.y, p.z)
	self.defaultTile = properties.defaultTile

	self.directionMap = {
		Constants.North: [Constants.North, Constants.East,  Constants.West],
		Constants.South: [Constants.South, Constants.East,  Constants.West],
		Constants.East:  [Constants.East,  Constants.North, Constants.South],
		Constants.West:  [Constants.West,  Constants.North, Constants.South],
	}[properties.direction]

func start():
	if defaultTile == null:
		return printerr("Default Tile is null. Did you implement that function on the biome builder?")

	carve(startPoint)

func carve(point:DungeonIndex):
	tileSource.setTile(point, defaultTile)
	biomeBuilder.removeFreeIndex(point)

	var direction = directionMap[0]
	var roll = randi_range(1,4)

	if roll == 1:
		direction = directionMap[1]
	if roll == 2:
		direction = directionMap[2]

	var nextPoint = point.go(direction)
	var nextTile = tileSource.getTile(nextPoint)

	if nextTile == null || nextTile.sector == defaultTile.sector || nextTile.isSolid():
		carve(nextPoint)
