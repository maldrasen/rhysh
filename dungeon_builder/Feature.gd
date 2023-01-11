extends Object

class_name Feature

var featureName
var sectorType
var canFlip
var size:Vector3i
var layers

func _init(featureName_):
	var template = MapData.lookupFeatureTemplate(featureName_)

	self.featureName = featureName_
	self.sectorType = template.sectorType
	self.canFlip = template.canFlip
	self.size = template.size
	self.layers = template.copyLayers()

func getTile(x,y,z):
	return self.layers[z][x + (y*size.x)]

# ==== Flipping ====================================================================================
# As a way to get more variety out of the feature templates we allow most features to be freely
# flipped, turning each feature into eight, unless they're symetrical of course. Right now these
# functions only work on single level features. I'll need to actually start making some multi level
# features before I can get them working with those. Should be as simple as doing the same
# operation on every level though.

func randomFlip():
	if canFlip:
		if randi() % 2 == 0:
			flipH()
		if randi() % 2 == 0:
			flipV()
		if randi() % 2 == 0:
			flipD()

func flipH():
	for z in layers.size():
		var oldTiles = layers[z]

		layers[z] = []
		layers[z].resize(self.size.x * self.size.y)

		for y in self.size.y:
			var newX = self.size.x - 1
			for x in self.size.x:
				var oldIndex = x + (y * self.size.x)
				var newIndex = newX + (y * self.size.x)

				layers[z][newIndex] = oldTiles[oldIndex]
				newX -= 1

				if layers[z][newIndex]:
					layers[z][newIndex].flipH()

func flipV():
	for z in layers.size():
		var oldTiles = layers[z]

		layers[z] = []
		layers[z].resize(self.size.x * self.size.y)

		for x in self.size.x:
			var newY = self.size.y - 1
			for y in self.size.y:
				var oldIndex = x + (y * self.size.x)
				var newIndex = x + (newY * self.size.x)

				layers[z][newIndex] = oldTiles[oldIndex]
				newY -= 1

				if layers[z][newIndex]:
					layers[z][newIndex].flipV()

# I was trying to rotate the tile matrix, but really only got it to flip along the diagonal axis
# doing it this way. Should be possible to rotate the tiles with a couple loops like this, but I'm
# to dumb to figure it out.
func flipD():
	for z in layers.size():
		var oldTiles = layers[z]
		var oldSize = size

		layers[z] = []
		layers[z].resize(self.size.x * self.size.y)
		self.size = Vector3i(oldSize.y, oldSize.x, 1)

		var newX = size.x
		var newY = 0

		for y in oldSize.y:
			newY = size.y
			newX -= 1
			for x in oldSize.x:
				newY -= 1
				var oldIndex = x + (y * self.size.y)
				var newIndex = newX + (newY * self.size.x)

				layers[z][newIndex] = oldTiles[oldIndex]
				if layers[z][newIndex]:
					layers[z][newIndex].flipD()

func _to_string():
	return "Feature[{0}]".format([featureName])
