extends Node
class_name DungeonBuilder

var randomSeed
var random
var freeTiles

func _init(s):
	self.randomSeed = s
	self.random = RandomNumberGenerator.new()
	self.random.seed = s
	self.freeTiles = {}

func buildNewDungeon():
	print("=== Building Dungeon ===")
	print("Seed:",randomSeed)

	Dungeon.setChunk(Vector3i(0,0,0),  buildChunkFromPrefab("Origin"))
	Dungeon.setChunk(Vector3i(-1,0,0), buildChunkFromPrefab("Origin-W"))
	Dungeon.setChunk(Vector3i(1,0,0),  buildChunkFromPrefab("Origin-E"))

	for x in range(-4,4):
		if x <= 2 || x >= -2:
			Dungeon.setChunk(Vector3(x,0,0),  buildChunkFromPrefab("Shore"))
		for y in range(1,5):
			print("Build random chunk in ({0},{1})".format([x,y]))

	for biome in freeTiles.keys():
		print("Biome({0}): {1} free tiles".format([BiomeManager.biomeToString(biome), freeTiles[biome].size() ]))

	# If the free tiles haven't been used we discard them. (They should all have been used)
	freeTiles = {}

	# Normally we'd save a chunk as soon as it's made, but in this initial creation step we can
	# save every chunk in the cache.
	for chunkIndex in Dungeon.chunkCache.keys():
		Dungeon.chunkCache[chunkIndex].save()

	# This is enough for now. The feature templates are being used to create chunks. Those chunks
	# are being stored in the Dungeon's chunk cache. That should be enough to drap a map of what we
	# have.

	# ============
	# Future Tasks
	# ============

	# We need to randomly generate dungeon tiles in the feature's build regions until they are
	# suficiently full. It might look better if this is all done at once. If we're placing several
	# dozen chunks they can span multiple build regions. They esentially act as biomes. I'll need
	# to add something to the tilemap that defines what biome the regions map too.
	#
	# The tricky part though will be determining which areas are empty and available for new
	# features. I could at least start from an array of indices that are empty. Pick one at random,
	# generate a feature for it, remove the indexes that it covers from the bag of available tiles.
	# Something like that.
	#
	# Going forward I'll be generating chunks as the player walks. I think I want to fo this in
	# zones first generate features in the most distant zones. Fill with mazes as they get closer,
	# and finally trim mazes back in only the closest chunks. So walking towards a new area you'll
	# have chunks in multiple states of generation. Something to try at least.
	#
	# Finally we need to hook up all the events and extensions and stuff. Do things like place
	# secret doors, connect switches. Sort of a polishing state at the end.


func buildChunkFromPrefab(featureName):
	var template:FeatureTemplate = FeatureLibrary.lookup(featureName)

	for biome in template.biomeAreas.keys():
		if false == freeTiles.has(biome):
			freeTiles[biome] = []
		freeTiles[biome].append_array(template.biomeAreas[biome])

	var chunk = Chunk.new()
	chunk.tiles = template.tiles
	return chunk
