extends Node

# The Dungeon class is used to keep track of the current dungeon state. This mostly involves zone
# loading, caching, and unloading, and sector management. At least for now.

var zoneInfo
var zoneChunks

# GDScript has nothing private, which is kind of annoying, because I'd really prefer for nothing to
# touch these variables directly. I suppose I could use some sort of Hungarian notation to annotate
# the variable names as being private, but I'd also prefer for my code to not look like ass.
var sectorCounter
var sectorDictionary

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

# ==== Sector Management ===========================================================================

# The next sector index to use.
func nextSector():
	return sectorCounter + 1

# The previous version the dungeon builder only used an array of ints to define sectors, but that
# was limiting because I couldn't tell if a tile was part of a room or a feature or a hallway or
# whatever. I don't think I'm going to need more information than that, so for now I'll try using
# strings for the sector types. If it turns out that there are a limited number of possible sector
# types, I could maybe turn this into an enum instead. If I need more data though, like which
# specific feature this tile belongs too I'll need to turn it into an object of some sort instead.
# These values are used to change how a tile is rendered, how much of the map is shown when the
# sector is entered.
#
#     outside   - Outside on the top level, The sky should be drawn above
#     building  - A single building. Could be many rooms connected with doors.
#     hall      - Standard dungeon corridor
#     room      - Standard dungeon room
#
func defineSector(sectorIndex, sectorType):
	if sectorDictionary.has(sectorIndex):
		return printerr("Error: Sector {0} has already been defined as {1}".format([sectorIndex, sectorDictionary[sectorIndex]]))
	sectorDictionary[sectorIndex] = sectorType
	sectorCounter += 1

# ==== Persistance =================================================================================

func pack():
	return {
		"zoneName":(zoneInfo.name if zoneInfo else null),
		"sectorDictionary": sectorDictionary,
		"sectorCounter": sectorCounter,
	}

func unpack(state):
	if state.zoneName:
		loadZone(state.zoneName)

	self.sectorCounter = state.sectorCounter
	self.sectorDictionary = state.sectorDictionary
