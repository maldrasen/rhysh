extends Node
class_name Chunk

const ChunkFilePath = "user://worlds/{0}/chunk[{1}][{2}][{3}].cum"

enum GenerationStage {
	Start,
	FeaturesPlaced,
	RegionsConnected,
	Trimmed,
	Complete
}

var tiles
var stage: GenerationStage
var chunkIndex: Vector3i

func _init():
	stage = GenerationStage.Start
	tiles = []

# ==== Persistance =================================================================================

func save():
	var packedTiles = []
	for tile in self.tiles:
		packedTiles.push_back(tile.pack() if tile else null)

	var chunkState = {
		"stage": self.stage,
		"chunkIndex": Data.packVector3i(self.chunkIndex),
		"tiles": packedTiles }

	var path = ChunkFilePath.format([GameState.currentWorld,chunkIndex.x,chunkIndex.y,chunkIndex.z])
	var file = FileAccess.open_compressed(path, FileAccess.WRITE, FileAccess.COMPRESSION_FASTLZ)
	file.store_line(JSON.stringify(chunkState))

	print("Saved: {0}".format([path]))

static func lode(index:Vector3i):
	var path = ChunkFilePath.format([GameState.currentWorld,index.x,index.y,index.z])
	var file = FileAccess.open_compressed(path, FileAccess.READ, FileAccess.COMPRESSION_FASTLZ)
	var document = JSON.parse_string(file.get_as_text())

	var unpackedTiles = []
	for tileData in document.tiles:
		unpackedTiles.push_back(Tile.unpack(tileData) if tileData else null)

	var chunk = Chunk.new()
	chunk.chunkIndex = Data.unpackVector3i(document.chunkIndex)
	chunk.stage = document.stage
	chunk.tiles = unpackedTiles

	print("Loaded ",chunk)
	return chunk

# ==== To String ===================================================================================

func _to_string():
	return "Chunk({0},{1},{2})".format([chunkIndex.x, chunkIndex.y, chunkIndex.z])
