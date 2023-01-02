extends Node

var zone
var zoneChunks

# GDScript has nothing private, which is kind of annoying, because I'd really prefer for nothing to
# touch these variables directly. I suppose I could use some sort of Hungarian notation to annotate
# the variable names as being private, but I'd also prefer for my code to not look like ass.
var regionCounter
var regionDictionary


func loadZone(zoneName):
	print("Loading Zone({0})".format([zoneName]))

	var loader = ZoneLoader.new(zoneName)
	if loader.hasBeenBuilt():
		loader.loadZoneData()
		loader.loadZoneChunks()
	else:
		loader.createZoneFromTemplate()

	self.zone = loader.zone
	self.zoneChunks = loader.chunks

# Function to fetch a chunk from the chunk cache. The function loads the chunk if it's not cached
# yet. This will return null if there's no file for the chunk. That's ok, some chunks, the ones
# north of the town or the shore for instance, will never exist.
func fetchChunk(chunkIndex:Vector3i):
	if zoneChunks.has(chunkIndex):
		return zoneChunks[chunkIndex]

func setTile(dungeonIndex:DungeonIndex, tile:Tile):
	var chunk = fetchChunk(dungeonIndex.chunkIndex())
	chunk.setTile(dungeonIndex.tileIndex(),tile)

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

# The next region index to use.
func nextRegion():
	return regionCounter + 1

# The previous version the dungeon builder only used an array of ints to define regions, but that
# was limiting because I couldn't tell if a tile was part of a room or a feature or a hallway or
# whatever. I don't think I'm going to need more information than that, so for now I'll try using
# strings for the region types. If it turns out that there are a limited number of possible region
# types, I could maybe turn this into an enum instead. If I need more data though, like which
# specific feature this tile belongs too I'll need to turn it into an object of some sort instead.
# These values are used to change how a tile is rendered, how much of the map is shown when the
# region is entered.
#
#     outside   - Outside on the top level, The sky should be drawn above
#     building  - A single building. Could be many rooms connected with doors.
#     hall      - Standard dungeon corridor
#     room      - Standard dungeon room
#
func defineRegion(regionIndex, regionType):
	if regionDictionary.has(regionIndex):
		return printerr("Error: Region {0} has already been defined as {1}".format([regionIndex, regionDictionary[regionIndex]]))
	regionDictionary[regionIndex] = regionType
	regionCounter += 1

# ==== Persistance =================================================================================

func pack():
	var zoneName

	# The zone will be null the first time the game is saved.
	if self.zone:
		zoneName = self.zone.name

	return {
		"zoneName": zoneName,
		"regionCounter": self.regionCounter,
		"regionDictionary": self.regionDictionary,
	}

func unpack(state):
	self.regionCounter = state.regionCounter
	self.regionDictionary = state.regionDictionary

	if state.zoneName:
		loadZone(state.zoneName)
