extends Node
class_name DungeonBuilder

var randomSeed
var random

func _init(s):
	self.randomSeed = s
	self.random = RandomNumberGenerator.new()
	self.random.seed = s

func buildNewDungeon():
	print("=== Building Dungeon ===")
	print("Seed:",randomSeed)
	print("Place:",FeatureLibrary.lookup("Origin"))

	# OK, next step is to place features. We have a template feature, loaded from the map JSON.
	# First we need a 3D tilemap for the dungeon to place tiles in.
	#
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
