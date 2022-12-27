extends Object
class_name FeatureTemplate

var featureName
var featureType
var regionType
var size:Vector3i
var biomeAreas
var tiles
var canFlip = false

func _init():
	size = Vector3i.ZERO
	biomeAreas = {}
	tiles = []
	tiles.resize(Constants.ChunkSize * Constants.ChunkSize)

# Used by the FeatureLoader to build a tile from tile data loaded from JSON
func buildTile(tileData):
	var tile = Tile.new()

	if tileData.root.walls:
		tile.setWallsFromString(tileData.root.walls, Wall.Certainty.Tentative)
	if tileData.root.floor:
		tile.setFloorFromString(tileData.root.floor)
	if tileData.has("extra"):
		tile.setExtra(tileData.extra)
	if tileData.has("extension"):
		tile.setExtension(tileData.extension)

	tiles[tileIndex(tileData.x, tileData.y)] = tile

# In addition to tiles a feature may contain biome areas, a list of tiles in a biome in the feature
# that should be randomly generated when built. We store the biome as an array of indices.
func defineBiomeArea(x,y,biome):
	if !biomeAreas.has(biome):
		biomeAreas[biome] = []
	biomeAreas[biome].append(tileIndex(x,y))

# When loaded from a tilemap tiles will have the (x,y) coords of their position in that map. They
# need to be put into the upper left corner before they can be placed.
func reorientTiles(vec):
	var oldTiles = self.tiles

	self.tiles = []
	self.tiles.resize(Constants.ChunkSize * Constants.ChunkSize)

	for x in Constants.ChunkSize:
		for y in Constants.ChunkSize:
			var dx = x + vec.x
			var dy = y + vec.y
			var newIndex = dx + dy*Constants.ChunkSize
			var oldIndex = x + y*Constants.ChunkSize

			if oldTiles[oldIndex]:
				tiles[newIndex] = oldTiles[oldIndex]

# We need to force this to make a copy of the tile array when creating a feature.
func copyTiles():
	var copy = []
	for tile in tiles:
		if tile:
			copy.push_back(Tile.unpack(tile.pack()))
		else:
			copy.push_back(null)
	return copy

func tileIndex(x,y):
	return x + (y * Constants.ChunkSize)

func _to_string():
	return "FeatureTemplate[{0}:{1}]".format([self.featureType,self.featureName])
