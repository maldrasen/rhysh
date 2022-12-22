extends Node
class_name DungeonIndex

var chunkIndex:Vector3
var tileIndex:Vector2

# TODO: Now that I've done all this... it really makes more sense to store the 
#       dungeon index as a plain Vector3 and get the chunk and tile indices 
#       from that. 

# Translate a flat dungeon coordinate into a DungeonIndex
static func at(x,y,z):
	var local_x = x % Constants.ChunkSize
	var local_y = y % Constants.ChunkSize
	var chunk_x = x / Constants.ChunkSize
	var chunk_y = y / Constants.ChunkSize

	return DungeonIndex.from(
		Vector3(chunk_x, chunk_y, z),
		Vector2(local_x, local_y))

# Build a DungeonIndex from a global chunk coordinate and a local tile coordinate
static func from(chunkIndex:Vector3, tileIndex:Vector2):
	var index = DungeonIndex.new()
	index.chunkIndex = chunkIndex
	index.tileIndex = tileIndex
	return index

# Build a DungeonIndex from a string with format "(x,y,z)"
static func fromString(string):
	for result in Static.DungeonIndexPattern.search_all(string):
		if result.strings.size() == 4:
			var x = int(result.strings[1])
			var y = int(result.strings[2])
			var z = int(result.strings[3])
			return DungeonIndex.at(x,y,z)

# Get the DungeonIndex as a Vector3
func index():
	return Vector3(
		(chunkIndex.x * Constants.ChunkSize) + tileIndex.x,
		(chunkIndex.y * Constants.ChunkSize) + tileIndex.y,
		chunkIndex.z)

# Get the DungeonIndex as a string with format "(x,y,z)"
func _to_string():
	var i = self.index()
	return "({0},{1},{2})".format([i.x, i.y, i.z])
