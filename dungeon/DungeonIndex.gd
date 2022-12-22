extends Node
class_name DungeonIndex

var chunkIndex:Vector3
var tileIndex:Vector2

# Translate a flat dungeon coordinate into a DungeonIndex
static func at(x,y,z):
	var local_x = x % Constants.ChunkSize
	var local_y = y % Constants.ChunkSize
	var chunk_x = x / Constants.ChunkSize
	var chunk_y = y / Constants.ChunkSize

	return DungeonIndex.from(
		Vector3(chunk_x, chunk_y, z),
		Vector2(local_x, local_y))

static func from(chunkIndex:Vector3, tileIndex:Vector2):
	var index = DungeonIndex.new()
	index.chunkIndex = chunkIndex
	index.tileIndex = tileIndex
	return index
