extends Control

var townScene = preload("res://town/Town.tscn").instantiate()
var dungeonThread

func _on_back_pressed():
	Signals.showMainMenu.emit()

# Right now we start a new game as soon as the button is pressed. We will want to add some 
# separation there eventually to check to see if the player name and shit has been set.
#
# When we create a new game we have to create the world configuration first. This creates the data
# directory for the dungeon to write itself into. It also creates the world configuration, and sets
# the random seed to use.
#
# We then kick off the dungeon builder in its own thread. Should be safe to do concurrently because
# it really only touches the chunk cache as it writes the chunk files to the disk.
#
# Finally we remove all the child nodes from main and add the town scene as a child node. Changing 
# scenes this way will allow the Main node to persist throughout the game. While we want to keep 
# game state in the various global variables (autoloads) having a persistant Main node will be 
# useful for UI elements we want to always have access too. Things like the save menu, or the 
# event view.

func _on_new_game_pressed():
	Configuration.createWorld()
	
	# Like my last implementation we also want to enqueue an event that runs while the dungeon is 
	# being build. We can leave that out for now while we work on the dungeon builder.

	dungeonThread = Thread.new()
	dungeonThread.start(buildNewDungeon)

	var root = get_tree().get_root()
	for child in root.get_children():
		root.remove_child(child)
	root.add_child(townScene)

func buildNewDungeon():
	DungeonBuilder.new(Configuration.worldConfiguration.seed).buildNewDungeon()
