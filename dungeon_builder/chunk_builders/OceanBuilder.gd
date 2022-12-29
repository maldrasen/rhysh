extends Object

class_name OceanBuilder

# The simplist chunk builder, it builds a chunk filled with nothing but water tiles.
static func build():
	var chunk = Chunk.new()

	var tile = Tile.new()
	tile.type = Tile.Type.Empty
	tile.region = DungeonBuilder.PredefinedRegions.Ocean.index
	tile.theFloor = Floor.new(Floor.Type.Water)

	for y in Constants.ChunkSize:
		for x in Constants.ChunkSize:
			chunk.setTile(Vector2i(x,y),tile)

	return chunk
