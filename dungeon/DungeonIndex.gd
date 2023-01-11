extends Object
class_name DungeonIndex

var index:Vector3i

# The DungeonIndex is just a wrapper around a Vector3i, but includes functions to translate global
# indices into chunk and tile indices. As it turns out there are some really difficult hurtles when
# dealing with negative indices using a coordinate system like this. There's a fencepost problem
# where a chunk with a -1 index are one tile smaller. I could get around this somehow, but I think
# it's easier to just forbid negative indices. That's still a lot of tiles in the positive integers.
func _init(x,y,z):
	if x < 0 || y < 0 || z < 0:
		printerr("A dungeon index cannot have a negative value.")
		return
	self.index = Vector3i(x,y,z)

# Build a DungeonIndex from a global chunk coordinate and a local tile coordinate
static func fromIndices(cIndex:Vector3i, tIndex:Vector2i) -> DungeonIndex:
	return DungeonIndex.new(
		(cIndex.x * Constants.ChunkSize) + tIndex.x,
		(cIndex.y * Constants.ChunkSize) + tIndex.y,
		cIndex.z)

# Build a Dungeon from a 3D vector representing its position in the global space.
static func fromVector(vec) -> DungeonIndex:
	return DungeonIndex.new(vec.x, vec.y, vec.z)

# Get the index of the adjecent tile in the direction.
func go(direction) -> DungeonIndex:
	if direction == Constants.North:
		return translate(Vector3i(0,-1,0))
	if direction == Constants.South:
		return translate(Vector3i(0,1,0))
	if direction == Constants.East:
		return translate(Vector3i(1,0,0))
	if direction == Constants.West:
		return translate(Vector3i(-1,0,0))

	return printerr(direction," isn't a real direction")

# Returns a new DungeonIndex because we don't want to mutate this one. If the translation would
# make this index negative return null.
func translate(point:Vector3i) -> DungeonIndex:
	var new = self.index + point
	if new.x < 0 || new.y < 0 || new.z < 0:
		return null

	return DungeonIndex.fromVector(new)

# Get the chunk index for this dungeon index. (Why is integer division a fucking warning, I want
# integer devision motherfucker. Bitch ass compiler...)
@warning_ignore(integer_division)
func chunkIndex() -> Vector3i:
	return Vector3i(
		index.x / Constants.ChunkSize,
		index.y / Constants.ChunkSize,
		index.z)

# Get the local tile index for this dungeon index.
func tileIndex() -> Vector2i:
	return Vector2i(
		index.x % Constants.ChunkSize,
		index.y % Constants.ChunkSize)

# ==== Persistance =================================================================================

func pack():
	return Utility.packVector3i(self.index)

static func unpack(array):
	var vec = Utility.unpackVector3i(array)
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

# Get a readable version that combines the chunk and tile indices.
func displayString():
	var chunk = chunkIndex()
	var tile = tileIndex()
	return "[{0},{1},{2}]({3},{4})".format([chunk.x,chunk.y,chunk.z,tile.x,tile.y])
