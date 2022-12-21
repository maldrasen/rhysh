extends Node
class_name Feature

var featureName
var featureType
var region
var size:Vector3
var buildRegions
var tiles

func _init():
	size = Vector3.ZERO 
	buildRegions = {}
	tiles = []
	tiles.resize(Constants.CHUNK_SIZE * Constants.CHUNK_SIZE)

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


# In addition to tiles a feature may contain build regions, a list of tiles in a region in the 
# feature that should be randomly generated when built. Right now I'm just storing the region as an
# array of indices. We'll probably need to convert them into a full sized tile map when building 
# them out. The dungeon generator will probably need to do that.
func defineBuildRegion(x,y,reg):
	if !buildRegions.has(reg):
		buildRegions[reg] = []
	buildRegions[reg].append(tileIndex(x,y))

func tileIndex(x,y):
	return x + (y * Constants.CHUNK_SIZE)
