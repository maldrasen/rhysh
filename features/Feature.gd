extends Node

class_name Feature

var featureName
var canFlip
var size:Vector3i
var tiles

func _init(name):
	var template = FeatureLibrary.lookup(name)

	self.featureName = name
	self.canFlip = template.canFlip
	self.size = template.size
	self.tiles = template.tiles

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
	print("<Flip:H>")
	var oldTiles = tiles

	self.tiles = []
	self.tiles.resize(Constants.ChunkSize * Constants.ChunkSize)

	for y in self.size.y:
		var newX = self.size.x - 1
		for x in self.size.x:
			var oldIndex = x + y * Constants.ChunkSize
			var newIndex = newX + y * Constants.ChunkSize

			self.tiles[newIndex] = oldTiles[oldIndex]
			newX -= 1

			if self.tiles[newIndex]:
				self.tiles[newIndex].flipH()

func flipV():
	print("<Flip:V>")
	var oldTiles = tiles

	self.tiles = []
	self.tiles.resize(Constants.ChunkSize * Constants.ChunkSize)

	for x in self.size.x:
		var newY = self.size.y - 1
		for y in self.size.y:
			var oldIndex = x + y * Constants.ChunkSize
			var newIndex = x + newY * Constants.ChunkSize

			self.tiles[newIndex] = oldTiles[oldIndex]
			newY -= 1

			if self.tiles[newIndex]:
				self.tiles[newIndex].flipV()

func flipD():
	print("<Flip:D>")
	var oldTiles = tiles
	var oldSize = size

	self.tiles = []
	self.tiles.resize(Constants.ChunkSize * Constants.ChunkSize)
	self.size = Vector3i(oldSize.y, oldSize.x, 1)

	var newX = size.x
	var newY = 0

	for y in oldSize.y:
		newY = size.y
		newX -= 1
		for x in oldSize.x:
			newY -= 1
			var oldIndex = x + y * Constants.ChunkSize
			var newIndex = newX + newY * Constants.ChunkSize

			self.tiles[newIndex] = oldTiles[oldIndex]
			if self.tiles[newIndex]:
				self.tiles[newIndex].flipD()
