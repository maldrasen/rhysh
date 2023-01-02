extends Object
class_name Chunk

const ChunkFilePath = "user://worlds/{0}/{1}[{2}][{3}][{4}].cum"

var tiles
var chunkIndex: Vector3i
var zoneName: String

func _init(name, index):
	self.zoneName = name
	self.chunkIndex = index
	self.tiles = []

func getTile(index:Vector2i):
	return tiles[tileIndex(index)]

func setTile(i:Vector2i, tile:Tile):
	var index = tileIndex(i)

	if index >= tiles.size():
		tiles.resize(Constants.ChunkSize * Constants.ChunkSize)

	tiles[index] = tile

func tileIndex(index:Vector2i):
	return (index.y * Constants.ChunkSize) + index.x

# ==== Persistance =================================================================================

func save():
	var packedTiles = []
	for tile in self.tiles:
		packedTiles.push_back(tile.pack() if tile else null)

	var chunkState = {
		"zoneName": self.zoneName,
		"chunkIndex": Utility.packVector3i(self.chunkIndex),
		"tiles": packedTiles }

	var path = ChunkFilePath.format([GameState.currentWorld,zoneName,chunkIndex.x,chunkIndex.y,chunkIndex.z])
	var file = FileAccess.open_compressed(path, FileAccess.WRITE, FileAccess.COMPRESSION_FASTLZ)
	file.store_line(JSON.stringify(chunkState))

	print("Saved: {0}".format([path]))

# Load a chunk given the zone and the chunk index.
static func loadChunk(name:String, index:Vector3i):
	loadChunkFile(ChunkFilePath.format([GameState.currentWorld,name,index.x,index.y,index.z]))

# Load a chunk given its filename.
static func loadChunkFile(path:String):
	var file = FileAccess.open_compressed(path, FileAccess.READ, FileAccess.COMPRESSION_FASTLZ)

	# If the chunk file doesn't exist, we return null here. That's probably fine as we might just
	# be checking to see if a chunk file exists.
	if file == null:
		return null

	var document = JSON.parse_string(file.get_as_text())

	var unpackedTiles = []
	for tileData in document.tiles:
		unpackedTiles.push_back(Tile.unpack(tileData) if tileData else null)

	var chunk = Chunk.new(document.zoneName, Utility.unpackVector3i(document.chunkIndex))
	chunk.tiles = unpackedTiles

	print("Loaded: {0}".format([chunk]))
	return chunk

# ==== To String ===================================================================================

func _to_string():
	return "{0}({1},{2},{3})".format([zoneName, chunkIndex.x, chunkIndex.y, chunkIndex.z])
