extends BiomeBuilder

class_name ForestBuilder

var sector = null

# [BiomeBuilder Implementation]
func placeFeatures():
	var size = freeTiles.size()
	var houseCount = floor(size/180)
	var treeCount = floor(size/9)

	addHouses(houseCount)
	addTrees(treeCount)
	fixWalls()
	fillSpace()

# Place a few houses outside of the city wall.
func addHouses(houseCount):
	while houseCount > 0:
		var feature = MapData.randomFeatureFromSet("farms")
		feature.randomFlip()

		var dungeonIndex = self.freeTiles.pick_random()
		if featureCanBePlaced(dungeonIndex,feature) == false:
			continue

		placeFeature(dungeonIndex,feature)
		houseCount -= 1

# Add a few trees. The area will still be fairly open.
func addTrees(treeCount):
	while treeCount > 0:
		var dungeonIndex = self.freeTiles.pick_random()

		if isIndexFree(dungeonIndex) == false:
			continue

		var tile = Tile.normal()
		tile.biome = biomeName
		tile.sector = sector
		tile.fillWithTree()

		setTile(dungeonIndex, tile)
		removeFreeIndex(dungeonIndex)
		treeCount -= 1

# After placing the features we want to loop though all of the tiles that have been placed and
# ensure that all the walls and doors have been correctly placed. It's possible that we've placed
# the tiles in such a way that doors cannot be connected. If that happens we need to abort and
# retry.
#
# I'm debating if the front door of a house having to enter into another house is an abortable
# error. On the one hand, it's a valid connection. On the other, it's weird looking. The real
# problem thoush is if the front door of a house leades into an unreachable pocket. This can happen
# if the trees form a fence around an open area in front of a door. No way to really detect that
# here. I think the connect sectors function will have to determine if that happens.
#
# TODO: This should really be a general purpose sort of a thing. Not sure if this should go into
#       the BiomeBuilder base class, or if I should make a WallFixer class. Also how can this be
#       made more general? It's rare we'll be dealing with trees after all.
func fixWalls():
	for index in usedTiles:
		var tile = getTile(index)
		var neighbors = getNeighborTiles(index)

		for direction in neighbors.keys():
			if tile.walls[direction]:
				fixWall(tile, neighbors[direction], direction)

# Need to figure out a way to make this more general use or every builder is going to have to have
# some version of this. In the LightForest though it has to destroy trees that spawned in the way
# of doors, and new tiles automatically go into the outside sector. Not sure if that logic carries
# over or not.
func fixWall(tile, neighbor, direction):
	var neighborIndex = neighbor.index
	var neighborTile = neighbor.tile
	var opposite = Utility.oppositeDirection(direction)
	var tileWall = tile.walls[direction]

	# If the neighbor tile doesn't exist, we can go ahead and create it if falls inside of the
	# free tiles array. It's possible that the neighbor tile is outside of the area we're building.
	# If it is though, the next builder needs to take care of fixing it.
	if neighborTile == null && isIndexFree(neighborIndex):
		neighborTile = Tile.normal()
		neighborTile.biome = biomeName
		neighborTile.sector = sector

		setTile(neighborIndex, neighborTile)
		removeFreeIndex(neighborIndex)

	# The neighbor tile will still be null if the tile was out of bounds for this builder. If
	# that's the case though we don't need to do anything.
	if neighborTile == null:
		return

	# If the opposing wall to this wall is null, we create either a wall or a door. In the future
	# there may be more wall types and wall data, but this should work for now.
	if neighborTile.walls[opposite] == null:
		if tileWall.type == Wall.Type.Normal:
			neighborTile.placeWall(opposite)
		if tileWall.type == Wall.Type.Door:
			neighborTile.placeDoor(opposite)

	# If this is a door tile, it can't open into a solid tile. It's fine though for trees to grow
	# against normal walls. Right now this removes anything filling the tile. May need to make
	# exceptions, perhaps even aborting the construction if it's trying to do something impossible.
	# (Could also make that part of gameplay... give the party a way to remove trees)
	if tileWall.type == Wall.Type.Door && neighborTile.type == Tile.Type.Solid:
		neighborTile.type = Tile.Type.Empty
		neighborTile.fill = null

	setTile(neighborIndex, neighborTile)

# Right now we're just filling the unused tiles with empty space.
func fillSpace():
	for index in freeTiles:
		var emptyTile = Tile.normal()
		emptyTile.biome = biomeName
		emptyTile.sector = sector

		setTile(index, emptyTile)

# [BiomeBuilder Implementation]
func connectSectors():
	pass

# [BiomeBuilder Implementation]
func trimDeadEnds():
	pass

# [BiomeBuilder Implementation]
func decorate():
	self.status = Constants.Status.Success
