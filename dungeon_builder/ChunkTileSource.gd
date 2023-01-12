extends Object

class_name ChunkTileSource

var chunks

func _init(chunks_):
	self.chunks = chunks_

func setTile(dungeonIndex:DungeonIndex, tile:Tile):
	chunks[dungeonIndex.chunkIndex()].setTile(dungeonIndex.tileIndex(), tile)

func getTile(dungeonIndex:DungeonIndex):
	return chunks[dungeonIndex.chunkIndex()].getTile(dungeonIndex.tileIndex())

func inRange(dungeonIndex:DungeonIndex):
	if chunks.has(dungeonIndex.chunkIndex()) == false:
		return false

# Given a dungeon index, and a tile source get the neighboring tiles along with their indices. The
# tile source is anything that has a getTile() function.
#   { N:{index:<>, tile:<>}, S:... }
func getNeighborTiles(dungeonIndex:DungeonIndex):

	var neighbors = {
		Constants.North: { "index":dungeonIndex.translate(Vector3i(0,-1,0)) },
		Constants.South: { "index":dungeonIndex.translate(Vector3i(0,1,0))  },
		Constants.East:  { "index":dungeonIndex.translate(Vector3i(1,0,0))  },
		Constants.West:  { "index":dungeonIndex.translate(Vector3i(-1,0,0)) },
	}

	neighbors[Constants.North].tile = getTile(neighbors[Constants.North].index)
	neighbors[Constants.South].tile = getTile(neighbors[Constants.South].index)
	neighbors[Constants.East].tile = getTile(neighbors[Constants.East].index)
	neighbors[Constants.West].tile = getTile(neighbors[Constants.West].index)

	return neighbors
