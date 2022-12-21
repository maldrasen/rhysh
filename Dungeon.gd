extends Node

var chunkCache = {}

func setChunk(chunkIndex:Vector3, chunk:Chunk):
	chunk.chunkIndex = chunkIndex
	chunkCache[chunkIndex] = chunk
