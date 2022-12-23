extends Node
class_name DungeonIndex

var index:Vector3i

# The DungeonIndex is just a wrapper around a Vector3i, but includes functions
# to translate indices and can be created from strings.
func _init(x,y,z):
	self.index = Vector3i(x,y,z)

# Build a DungeonIndex from a global chunk coordinate and a local tile coordinate
static func fromIndices(chunkIndex:Vector3i, tileIndex:Vector2i):
	return DungeonIndex.new(
		(chunkIndex.x * Constants.ChunkSize) + tileIndex.x,
		(chunkIndex.y * Constants.ChunkSize) + tileIndex.y,
		chunkIndex.z)

static func fromVector(vec):
	return DungeonIndex.new(vec.x, vec.y, vec.z)

# Returns a new DungeonIndex because we don't want to mutate this one.
func translate(point:Vector3i):
	return DungeonIndex.fromVector(self.index + point)


func chunkIndex():
	var chunkIndex = Vector3i(
		index.x / Constants.ChunkSize,
		index.y / Constants.ChunkSize,
		index.z)

	if index.x < 0:
		chunkIndex.x -= 1
	if index.y < 0:
		chunkIndex.y -= 1

	return chunkIndex

func tileIndex():
	return Vector2i(
		index.x % Constants.ChunkSize,
		index.y % Constants.ChunkSize)

# ==== Persistance =================================================================================

func pack():
	return Data.packVector3i(self.index)

static func unpack(array):
	var vec = Data.unpackVector3i(array)
	return DungeonIndex.new(vec.x, vec.y, vec.z)

# ==== To String ===================================================================================

# Build a DungeonIndex from a string with format "(x,y,z)". Now that I think
# about it though, this is pretty dumb, so don't use it for persistance, but
# keep it around because I can't remember how Godot Regexes work.
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
