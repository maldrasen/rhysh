extends Node

var chunkCache = {}

func setChunk(chunkIndex:Vector3i, chunk:Chunk):
	chunk.chunkIndex = chunkIndex
	chunkCache[chunkIndex] = chunk
