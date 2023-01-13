extends Object

class_name TunnelDigger

var biomeBuilder
var tileSource
var connectionPoints
var defaultTile

# The TunnelDigger carves a series of narrow tunnels in an area filled with mostly stone. It does
# this by picking a random tile from the free tiles, finds the closest tile it can connect to, and
# diggs a diagonal tunnel to that point. There's a bit of randomness in the tunnel to keep them
# from looking like streight lines.
func _init(properties):
	self.biomeBuilder = properties.biomeBuilder
	self.tileSource = properties.tileSource
	self.defaultTile = properties.defaultTile
	self.connectionPoints = []

func start():
	for i in floor(biomeBuilder.freeTiles.size() / 50):
		connectionPoints.push_back(biomeBuilder.freeTiles.pick_random())

	while connectionPoints.size() > 0:
		var toPoint = connectionPoints.pick_random()
		var fromPoint = closestConnectionTo(toPoint)
		connectPoints(fromPoint, toPoint)
		connectionPoints.erase(toPoint)

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
	if tileSource.inRange(point) == false:
		return false
	if biomeBuilder.usedTiles.has(point):
		return true

	var tile = tileSource.getTile(point)
	return tile != null && tile.sector == defaultTile.sector

func connectPoints(fromPoint, toPoint):
	var xOffset = fromPoint.index.x - toPoint.index.x
	var yOffset = fromPoint.index.y - toPoint.index.y
	var horizontal = Constants.East if fromPoint.index.x < toPoint.index.x else Constants.West
	var vertical = Constants.South if fromPoint.index.y < toPoint.index.y else Constants.North

	if xOffset == 0 && yOffset == 0:
		return

	var direction = randomDirection(xOffset, yOffset, horizontal, vertical)
	var nextPoint = fromPoint.go(direction)
	var nextTile = tileSource.getTile(nextPoint)

	# The only big problem with connecting tiles this way is that sometimes we randomly fall off a
	# cliff, this should be fine though. I don't think it can happen for the most important
	# connection points.
	if nextTile != null && nextTile.hasFloor() == false:
		return

	tileSource.setTile(nextPoint, defaultTile.copy())
	biomeBuilder.removeFreeIndex(nextPoint)
	connectPoints(nextPoint, toPoint)

func randomDirection(xOffset, yOffset, horizontal, vertical):
	var roll = randi_range(1,12)
	if abs(xOffset) < abs(yOffset):
		return horizontal if roll < 4 else vertical
	if abs(xOffset) > abs(yOffset):
		return vertical if roll < 4 else horizontal
	return vertical if roll < 7 else horizontal
