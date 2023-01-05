extends Node

# The Dungeon class is used to keep track of the current dungeon state. This mostly involves zone
# loading, caching, and unloading, at least for now.

var zoneInfo
var zoneChunks

# Load a zone and set it as the current zone.
func loadZone(zoneName):
	print("Loading Zone({0})".format([zoneName]))

	var loader = ZoneLoader.new(zoneName)
	if loader.hasBeenBuilt():
		MapData.loadZoneData(zoneName)
		loader.loadZoneChunks()
	else:
		loader.createZoneFromTemplate()

	self.zoneInfo = loader.zoneInfo
	self.zoneChunks = loader.chunks

	print("Loaded {0} ({1} chunks)\n".format([zoneName, zoneChunks.size()]))

# Function to fetch a chunk from the loaded chunks. This will return null if there's no file for
# the chunk, which is to be expected sometimes.
func fetchChunk(chunkIndex:Vector3i):
	if zoneChunks.has(chunkIndex):
		return zoneChunks[chunkIndex]

# This will return the tile at the dungeon index if it exists.
func fetchTile(dungeonIndex:DungeonIndex):
	var chunk = fetchChunk(dungeonIndex.chunkIndex())
	if chunk:
		return chunk.getTile(dungeonIndex.tileIndex())

# Given a dungeon index, get the neighboring tiles along with their indices.
#   { N:{index:<>, tile:<>}, S:... }
func fetchNeighborTiles(dungeonIndex:DungeonIndex):
	var neighbors = {
		Constants.North: { "index":dungeonIndex.translate(Vector3i(0,-1,0)) },
		Constants.South: { "index":dungeonIndex.translate(Vector3i(0,1,0))  },
		Constants.East:  { "index":dungeonIndex.translate(Vector3i(1,0,0))  },
		Constants.West:  { "index":dungeonIndex.translate(Vector3i(-1,0,0)) },
	}

	neighbors[Constants.North].tile = fetchTile(neighbors[Constants.North].index)
	neighbors[Constants.South].tile = fetchTile(neighbors[Constants.South].index)
	neighbors[Constants.East].tile = fetchTile(neighbors[Constants.East].index)
	neighbors[Constants.West].tile = fetchTile(neighbors[Constants.West].index)

	return neighbors


# ==== Persistance =================================================================================

func pack():
	return { "zoneName":(zoneInfo.name if zoneInfo else null) }

func unpack(state):
	if state.zoneName:
		loadZone(state.zoneName)
