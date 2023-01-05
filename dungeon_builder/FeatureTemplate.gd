extends Object

class_name FeatureTemplate

var name
var regionType
var canFlip
var size:Vector3i
var layers

func _init(info):
	self.layers = []
	self.name = info["Name"]
	self.regionType = info["RegionType"]
	self.canFlip = info["Flip"]
	self.size = Vector3i(info["Width"], info["Height"], info["Depth"])

	for i in self.size.z:
		var tiles = []
		tiles.resize(self.size.x * self.size.y)
		layers.push_back({ "tiles":tiles })

# I'm storing the tiles in kind of a strange way. A FeatureTemplate has a 3D volume of tiles,
# though they'll usually only be a single z-level. There's a layer for each z level, and each layer
# has a 1D array of tiles which is indexed as a 2D plane.

func setTile(index:Vector3i, tile:Tile):
	self.layers[index.z].tiles[tileIndex(index)]

func getTile(index:Vector3i) -> Tile:
	return self.layers[index.z].tiles[tileIndex(index)]

func tileIndex(index:Vector3i):
	return index.x + (index.y * self.size.x)
