extends Object

class_name ZoneBuilder

# Dont set tiles outside of the builder.
#func setTile(dungeonIndex:DungeonIndex, tile:Tile):
#	var chunk = fetchChunk(dungeonIndex.chunkIndex())
#	chunk.setTile(dungeonIndex.tileIndex(),tile)

# These don't really belong in the dungeon class. Regions either belong in the game state or in
# the zone builder, depending on how long region information should persist for.

# GDScript has nothing private, which is kind of annoying, because I'd really prefer for nothing to
# touch these variables directly. I suppose I could use some sort of Hungarian notation to annotate
# the variable names as being private, but I'd also prefer for my code to not look like ass.
#var regionCounter
#var regionDictionary
# The next region index to use.
#func nextRegion():
#	return regionCounter + 1

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
#func defineRegion(regionIndex, regionType):
#	if regionDictionary.has(regionIndex):
#		return printerr("Error: Region {0} has already been defined as {1}".format([regionIndex, regionDictionary[regionIndex]]))
#	regionDictionary[regionIndex] = regionType
#	regionCounter += 1
