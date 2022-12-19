extends Control

var DungeonBuilder = preload("res://dungeon_builder/DungeonBuilder.gd")
var townScene = preload("res://town/Town.tscn").instantiate()
var dungeonThread

func _on_back_pressed():
	Signals.showMainMenu.emit()

func _on_new_game_pressed():
	Configuration.createWorld()

	dungeonThread = Thread.new()
	dungeonThread.start(buildNewDungeon)

	# Like my last implementation we also want to enqueue an event that runs while the dungeon is 
	# being build. We can leave that out for now while we work on the dungeon builder.

	# Remove all the child nodes from main and add the town scene as a child node. Changing scenes 
	# this way will allow the Main node to persist throughout the game. While we want to keep game
	# state in the various global variables (autoloads) having a persistant Main node will be 
	# useful for UI elements we want to always have access too. Things like the save menu, or the  
	# event view.
	var root = get_tree().get_root()
	for child in root.get_children():
		root.remove_child(child)
	root.add_child(townScene)

func buildNewDungeon():
	DungeonBuilder.new().buildNewDungeon()
