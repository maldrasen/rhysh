extends Node

class_name DungeonBuilder

var seed
var random

func _init(seed):
	self.seed = seed
	self.random = RandomNumberGenerator.new()
	self.random.seed = seed

func buildNewDungeon():
	print("=== Building Dungeon ===")
	print("Seed:",seed)
	
