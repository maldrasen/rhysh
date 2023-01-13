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
	return false if chunks.has(dungeonIndex.chunkIndex()) == false else true

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

	# These indices could all be out of bounds or null
	var n = neighbors[Constants.North].index
	var s = neighbors[Constants.South].index
	var e = neighbors[Constants.East].index
	var w = neighbors[Constants.West].index

	if n != null && inRange(n):
		neighbors[Constants.North].tile = getTile(n)
	if s != null && inRange(s):
		neighbors[Constants.South].tile = getTile(s)
	if e != null && inRange(e):
		neighbors[Constants.East].tile = getTile(e)
	if w != null && inRange(w):
		neighbors[Constants.West].tile = getTile(w)

	return neighbors
