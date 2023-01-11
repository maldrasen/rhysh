extends BiomeBuilder

class_name CleftBuilder

var cleftSector

# [BiomeBuilder Implementation]
# First, randomly select carve points to start from. Carve into the empty area until path length is
# reached or something solid is encountered. Carving is done with a random walk, but mostly heads
# away from the empty space next to the carve point.
#
# TODO: Also maybe add some cleft specific features before we carve all these paths.
func placeFeatures():
	self.cleftSector = Dungeon.nextSector()
	Dungeon.defineSector(cleftSector, "outside")

	for i in floor(self.supplementaryData.CarvePoints.size() / 3):
		var startIndex = DungeonIndex.fromVector(self.supplementaryData.CarvePoints.pick_random())
		var neighbors = self.getNeighborTiles(startIndex)
		var direction = Constants.NSEW.pick_random()

		for facing in Constants.NSEW:
			if neighbors[facing].tile != null:
				direction = Utility.oppositeDirection(facing)

		var averageLength = calculatePathLength(startIndex, direction)
		var length = random.randi_range(averageLength, averageLength*2)

		carvePath(startIndex, getDirectionMap(direction), length)

# [BiomeBuilder Implementation]
# The CleftBuilder doesn't actually the sectors to make connections. Instead we get the few points
# we absolutely have to connect from the supplementary data. We add a bunch of points randomly to
# this list, then connect all of these points to their closest connectable tile. In the end this
# looks like a bunch of random cracks which is what we want.
func connectSectors():
	if self.supplementaryData.has("connectionPoints") == false:
		self.supplementaryData.connectionPoints = []

	for i in floor(freeTiles.size() / 50):
		self.supplementaryData.connectionPoints.push_back(freeTiles.pick_random())

	while self.supplementaryData.connectionPoints.size() > 0:
		var toPoint = self.supplementaryData.connectionPoints.pick_random()
		var fromPoint = closestConnectionTo(toPoint)
		connectPoints(fromPoint, toPoint)
		self.supplementaryData.connectionPoints.erase(toPoint)

# [BiomeBuilder Implementation]
func trimDeadEnds():
	pass

# Sometimes the most important thing that this is supposed to connect just doesn't fucking connect.
# No idea why. The possible fixes I thought of all involve first checking to see if there's a
# problem. Probably something like a shortest path algorithm from the important connection points
# to a road tile. Maybe force a reset and regeneration of the whole zone. I could also just brute
# force it, open up another tunnel that bulldozes its way from the cave entrace to the first road
# tile it hits, actually might just do that anyway, then I don't even have to check to see if
# there's a problem first.
# [BiomeBuilder Implementation]
func decorate():

	# TODO: Add all the walls, maybe fill in empty spaces with solid tile, that's not actually
	#       nessessary though.
	self.status = Constants.Status.Success

# ==== Cleft Carving ===============================================================================

func calculatePathLength(index:DungeonIndex, direction):
	var nextIndex = index.go(direction)
	var length = 1

	while true:
		if  length > 100 || getTile(nextIndex) != null:
			return length

		nextIndex = nextIndex.go(direction)
		length += 1

func getDirectionMap(direction):
	return {
		Constants.North: [Constants.North, Constants.East,  Constants.West],
		Constants.South: [Constants.South, Constants.East,  Constants.West],
		Constants.East:  [Constants.East,  Constants.North, Constants.South],
		Constants.West:  [Constants.West,  Constants.North, Constants.South],
	}[direction]

func carvePath(index, directionMap, length):
	if getTile(index) != null:
		return

	var direction = directionMap[0]
	var roll = random.randi_range(1,6)

	if roll == 1:
		direction = directionMap[1]
	if roll == 2:
		direction = directionMap[2]

	setTile(index, cleftTile())
	removeFreeIndex(index)

	if length > 0:
		carvePath(index.go(direction), directionMap, length-1)

# ==== Make Connections ============================================================================

func closestConnectionTo(point):
	var radius = 0
	var other

	while other == null:
		radius += 1
		other = findClosestConnection(point, radius)

	return other

func findClosestConnection(point, radius):
	for r in range(-radius,radius):
		var north = point.translate(Vector3i(r,-radius,0))
		if canConnect(north):
			return north

		var south = point.translate(Vector3i(r,radius,0))
		if canConnect(south):
			return south

		var east = point.translate(Vector3i(radius,r,0))
		if canConnect(east):
			return east

		var west = point.translate(Vector3i(-radius,r,0))
		if canConnect(west):
			return west

func canConnect(point):
	if point == null:
		return false
	if inRange(point) == false:
		return false
	if self.usedTiles.has(point):
		return true

	var tile = getTile(point)
	return tile != null && tile.sector == cleftSector

func connectPoints(fromPoint, toPoint):
	var xOffset = fromPoint.index.x - toPoint.index.x
	var yOffset = fromPoint.index.y - toPoint.index.y
	var horizontal = Constants.East if fromPoint.index.x < toPoint.index.x else Constants.West
	var vertical = Constants.South if fromPoint.index.y < toPoint.index.y else Constants.North

	if xOffset == 0 && yOffset == 0:
		return

	var direction = randomDirection(xOffset, yOffset, horizontal, vertical)
	var nextPoint = fromPoint.go(direction)
	var nextTile = getTile(nextPoint)

	# The only big problem with connecting tiles this way is that sometimes we randomly fall off a
	# cliff, this should be fine though. I don't think it can happen for the most important
	# connection points.
	if nextTile != null && nextTile.hasFloor() == false:
		return

	setTile(nextPoint, cleftTile())
	removeFreeIndex(nextPoint)
	connectPoints(nextPoint, toPoint)

func randomDirection(xOffset, yOffset, horizontal, vertical):
	var roll = random.randi_range(1,12)
	if abs(xOffset) < abs(yOffset):
		return horizontal if roll < 4 else vertical
	if abs(xOffset) > abs(yOffset):
		return vertical if roll < 4 else horizontal
	return vertical if roll < 7 else horizontal

# ==== Other =======================================================================================

func cleftTile():
	var tile = Tile.normal()
	tile.biome = "Cleft"
	tile.sector = cleftSector
	return tile
