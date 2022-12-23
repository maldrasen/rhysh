extends Node

var chunkCache = {}

func setChunk(chunkIndex:Vector3i, chunk:Chunk):
	chunk.chunkIndex = chunkIndex
	chunkCache[chunkIndex] = chunk

# Function to fetch a chunk from the chunk cache. The function loads the chunk if it's not cached
# yet. This will return null if there's no file for the chunk. That's ok, some chunks, the ones
# north of the town or the shore for instance, will never exist.
func fetchChunk(chunkIndex:Vector3i):
	if chunkCache.has(chunkIndex):
		return chunkCache[chunkIndex]

	var chunk = Chunk.lode(chunkIndex)
	if chunk:
		chunkCache[chunkIndex] = chunk
	return chunk
