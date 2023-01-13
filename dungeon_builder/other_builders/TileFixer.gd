extends Object

class_name TileFixer

var tileSource
var canRemove

func _init(properties):
	self.tileSource = properties.tileSource
	self.canRemove = []

# As a final step we loop though all of the tiles in the zone and ensure that all the walls and
# doors have been correctly placed.
func start():
	for chunkIndex in tileSource.chunks:
		for y in Constants.ChunkSize:
			for x in Constants.ChunkSize:
				checkIndex(DungeonIndex.fromIndices(chunkIndex, Vector2i(x,y)));

	for removeIndex in canRemove:
		tileSource.setTile(removeIndex, null)

@warning_ignore(unused_variable)
func checkIndex(index:DungeonIndex):
	var tile = tileSource.getTile(index)
	if tile != null:
		var neighbors = tileSource.getNeighborTiles(index)
		var derp = canRemove.push_back(index) if canBeRemoved(neighbors) else fixWalls(tile, neighbors, index)

func canBeRemoved(neighbors):
	for direction in Constants.NSEW:
		if neighbors[direction] == null:
			continue
		if neighbors[direction].has("tile") == false:
			continue
		if neighbors[direction].tile == null:
			continue
		if neighbors[direction].tile.isSolidStone() == false:
			return false
	return true

func fixWalls(tile, neighbors, index):
	for direction in Constants.NSEW:
		if neighbors[direction].has("tile"):
			fixWall(tile, neighbors[direction].tile, direction)
	tileSource.setTile(index, tile)

func fixWall(tile:Tile, neighbor:Tile, direction):
	if tile.canHaveWall() == false:
		return

	var tileWall = tile.walls[direction]
	var oppositeWall = getOppositeWall(neighbor, direction)

	# Make sure both sides of a tile have doors and walls.
	if !isWall(tileWall) && isWall(oppositeWall):
		tile.placeWall(direction)
	if !isDoor(tileWall) && isDoor(oppositeWall):
		tile.placeDoor(direction)

	# Occationally something like a tree will spawn where a door should go.
	if tile.isTree() && isDoor(oppositeWall):
		tile.makeEmpty()

	# Null neighbors should be pretty rare now, but walled off.
	if neighbor == null:
		tile.placeWall(direction)

	# There should be a wall if the neighbor tile is solid stone.
	if neighbor && neighbor.isSolidStone():
		tile.placeWall(direction)

func getOppositeWall(neighbor, direction):
	if neighbor == null:
		return null
	return neighbor.walls[Utility.oppositeDirection(direction)]

func isDoor(wall):
	return wall != null && wall.type == Wall.Type.Door

func isWall(wall):
	return wall != null && wall.type == Wall.Type.Normal
