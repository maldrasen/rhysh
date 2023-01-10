extends Object

class_name FeatureTemplate

var name
var sectorType
var canFlip
var size:Vector3i
var layers

func _init(info):
	self.layers = []
	self.name = info["Name"]
	self.sectorType = info["SectorType"]
	self.canFlip = info["Flip"]
	self.size = Vector3i(info["Width"], info["Height"], info["Depth"])

	for i in self.size.z:
		var tiles = []
		tiles.resize(self.size.x * self.size.y)
		layers.push_back(tiles)

# I'm storing the tiles in kind of a strange way. A FeatureTemplate has a 3D volume of tiles,
# though they'll usually only be a single z-level. There's a layer for each z level, and each layer
# has a 1D array of tiles which is indexed as a 2D plane.

func setTile(index:Vector3i, tile:Tile):
	self.layers[index.z][tileIndex(index)] = tile

func getTile(index:Vector3i) -> Tile:
	return self.layers[index.z][tileIndex(index)]

func tileIndex(index:Vector3i):
	return index.x + (index.y * self.size.x)

# We need to force this to make a copy of all the tiles when creating a feature.
func copyLayers():
	var copy = []
	for layer in self.layers:
		var tiles = []
		for tile in layer:
			if tile:
				tiles.push_back(Tile.unpack(tile.pack()))
			else:
				tiles.push_back(null)
		copy.push_back(tiles)
	return copy

func _to_string():
	return "FeatureTemplate[{0}]".format([name])
