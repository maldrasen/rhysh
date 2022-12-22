extends Node
class_name DungeonIndex

var index:Vector3i

# The DungeonIndex is just a wrapper around a Vector3i, but includes functions
# to translate indices and can be created from strings.
func _init(x,y,z):
	self.index = Vector3i(x,y,z)

# Build a DungeonIndex from a global chunk coordinate and a local tile coordinate
static func from(chunkIndex:Vector3i, tileIndex:Vector2i):
	return DungeonIndex.new(
		(chunkIndex.x * Constants.ChunkSize) + tileIndex.x,
		(chunkIndex.y * Constants.ChunkSize) + tileIndex.y,
		chunkIndex.z)

# Build a DungeonIndex from a string with format "(x,y,z)"
static func fromString(string):
	for result in Static.DungeonIndexPattern.search_all(string):
		if result.strings.size() == 4:
			var x = int(result.strings[1])
			var y = int(result.strings[2])
			var z = int(result.strings[3])
			return DungeonIndex.new(x,y,z)

# Get the DungeonIndex as a string with format "(x,y,z)"
func _to_string():
	return "({0},{1},{2})".format([self.index.x, self.index.y, self.index.z])
