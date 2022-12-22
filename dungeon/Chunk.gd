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

	FileAccess.open_compressed(path, FileAccess.WRITE, FileAccess.COMPRESSION_FASTLZ).store_line(
		JSON.stringify(chunkState))

	print("Saved: {0}".format([path]))

# ==== To String ===================================================================================

func _to_string():
	return "Chunk({0},{1},{2})".format([chunkIndex.x, chunkIndex.y, chunkIndex.z])
