extends Object

class_name CrackDigger

var tileSource
var carvePoints
var defaultTile

# The tunneler randomly selects carve points to start from, then carves into an empty area until
# path length is reached or something solid is encountered. Carving is done with a random walk,
# but mostly heads away from the empty space next to the carve point. This is designed to produce a
# series of cracks heading away from an open space.
func _init(properties):
	self.tileSource = properties.tileSource
	self.defaultTile = properties.defaultTile
	self.carvePoints = []+properties.carvePoints

# Builds the cracks from the given density. Should be beteen 0 and 1. A higher density leads to
# more cracks.
func start(density):
	for i in floor(carvePoints.size() * density):
		var startIndex = DungeonIndex.fromVector(carvePoints.pick_random())
		var neighbors = tileSource.getNeighborTiles(startIndex)
		var direction = Constants.NSEW.pick_random()

		for facing in Constants.NSEW:
			if neighbors[facing].tile != null:
				direction = Utility.oppositeDirection(facing)

		var averageLength = calculatePathLength(startIndex, direction)
		var length = randi_range(averageLength, averageLength*2)

		carvePath(startIndex, getDirectionMap(direction), length)

# The path length is determined by how far from the start index we can go in the specified
# direction before we run into an already defined tile. This probably need to check to make sure we
# don't go out of bounds either. Max path length is 100.
func calculatePathLength(index:DungeonIndex, direction):
	var nextIndex = index.go(direction)
	var length = 1

	while true:
		if  length > 100 || tileSource.getTile(nextIndex) != null:
			return length

		nextIndex = nextIndex.go(direction)
		length += 1

# This returns an array of the possible directions that the tunnel will go, with the first element
# being the most likely.
func getDirectionMap(direction):
	return {
		Constants.North: [Constants.North, Constants.East,  Constants.West],
		Constants.South: [Constants.South, Constants.East,  Constants.West],
		Constants.East:  [Constants.East,  Constants.North, Constants.South],
		Constants.West:  [Constants.West,  Constants.North, Constants.South],
	}[direction]

func carvePath(index, directionMap, length):
	if tileSource.getTile(index) != null:
		return

	var direction = directionMap[0]
	var roll = randi_range(1,6)

	if roll == 1:
		direction = directionMap[1]
	if roll == 2:
		direction = directionMap[2]

	tileSource.setTile(index, defaultTile)
	tileSource.removeFreeIndex(index)

	if length > 0:
		carvePath(index.go(direction), directionMap, length-1)
