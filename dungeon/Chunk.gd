extends Node
class_name Chunk

enum GenerationStage {
	Start,
	FeaturesPlaced,
	RegionsConnected,
	Trimmed,
	Complete
}

var tiles
var stage: GenerationStage
var chunkIndex: Vector3


func _init():
	stage = GenerationStage.Start
	tiles = []

func _to_string():
	return "Chunk({0},{1},{2})".format([chunkIndex.x, chunkIndex.y, chunkIndex.z])
