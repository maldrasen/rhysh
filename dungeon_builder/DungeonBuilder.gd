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
	print("R:",random.randi_range(1, 20))

	# Ohh, using another class is super easy. Preload I think is only needed 
	# for instances maybe?
	var c = Chunk.new()
	
