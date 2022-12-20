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
