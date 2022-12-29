extends Object
class_name DungeonBuilder

const PredefinedRegions = {
	"Ocean":              { "index":1, "type":"outside" },
	"LightForestOutside": { "index":2, "type":"outside" },
	"GardenOutside":      { "index":3, "type":"outside" },
	"DarkWoodOutside":    { "index":4, "type":"outside" }}

var randomSeed
var random: RandomNumberGenerator
var worldMap
var freeTiles

func _init(s):
	self.randomSeed = s
	self.random = RandomNumberGenerator.new()
	self.random.seed = s
	self.freeTiles = {}

	for region in PredefinedRegions.values():
		Dungeon.defineRegion(region.index, region.type)

# I've realized that I need to split the initial dungeon generation into two parts. I first create
# a world map, which maps out which chunks should generate in which locations. There's a bit of
# randomness to where things are located so that every game doesn't look quite the same.
func buildNewDungeon():
	print("\n=== Building Dungeon ===")
	print("Seed:",randomSeed)

	worldMap = WorldMap.new(random)
	worldMap.build()
	placeChunks()



func placeChunks():
	var chunkIndex
	var chunk

	var origin = GameState.partyLocation.chunkIndex()
	for y in range(origin.y-1, origin.y+5):
		for x in range(origin.x-5, origin.x+5):
			buildChunk(Vector3i(x,y,origin.z))

	for biome in freeTiles.keys():
		var builder = {
			Constants.Biome.LightForest: LightForestBuilder,
			Constants.Biome.Garden:      GardenBuilder,
			Constants.Biome.DarkWood:    DarkWoodBuilder,
		}[biome].new(biome)

		while builder.status != Constants.Status.Success:
			builder.setFreeTiles(freeTiles[biome])
			builder.fullBuild()

	# If the free tiles haven't been used we discard them. (They should all have been used)
	print("---")
	freeTiles = {}

	# Normally we'd save a chunk as soon as it's made, but in this initial creation step we can
	# save every chunk in the cache.
	for index in Dungeon.chunkCache.keys():
		Dungeon.chunkCache[index].save()

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







func buildChunk(chunkIndex):
	var chunkType = worldMap.chunkTypeAt(chunkIndex)
	var chunk = null

	if chunkType.has("prefab"):
		chunk = buildChunkFromPrefab(chunkIndex, chunkType.prefab)

	if chunkType.has("type"):
		if chunkType.type == "Ocean":
			chunk = OceanBuilder.build()

	if chunk == null:
		print("  TODO: Build {0} Chunks".format([chunkType]))

	if chunk:
		Dungeon.setChunk(chunkIndex, chunk)

# Build a chunk from a prefabricated chunk map.
#
# TODO: The tiles that are being set from these templates don't have a region. I'm not sure if
#       that's okay or not yet.
func buildChunkFromPrefab(chunkIndex:Vector3i, featureName):
	var template:FeatureTemplate = FeatureLibrary.lookup(featureName)

	for biome in template.biomeAreas.keys():
		if false == freeTiles.has(biome):
			freeTiles[biome] = []

		for localIndex in template.biomeAreas[biome]:
			freeTiles[biome].push_back(DungeonIndex.fromIndices(chunkIndex, Vector2i(
				localIndex % Constants.ChunkSize,
				localIndex / Constants.ChunkSize
			)))

	var chunk = Chunk.new()
	chunk.tiles = template.tiles
	return chunk
