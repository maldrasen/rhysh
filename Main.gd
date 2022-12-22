extends Node

var dungeonScene = preload("res://dungeon_interface/DungeonInterface.tscn").instantiate()
var townScene = preload("res://town/Town.tscn").instantiate()

func _ready():
	DisplayServer.window_set_min_size(Constants.WINDOW_SIZE)

	Signals.showMainMenu.connect(on_showMainMenu)
	Signals.showNewGame.connect(on_showNewGame)
	Signals.showLoadGame.connect(on_showLoadGame)
	Signals.showContinueGame.connect(on_showContinueGame)
	Signals.showConfiguration.connect(on_showConfiguration)

	Signals.openTown.connect(on_openTown)
	Signals.openDungeon.connect(on_openDungeon)

func hideOthers():
	$MainMenu.visible = false
	$NewGame.visible = false
	$LoadGame.visible = false
	$ConfigurationMenu.visible = false

func on_showMainMenu():
	hideOthers();
	$MainMenu.visible = true

func on_showNewGame():
	hideOthers();
	$NewGame.visible = true

func on_showLoadGame():
	hideOthers();
	$LoadGame.visible = true

func on_showConfiguration():
	hideOthers();
	$ConfigurationMenu.visible = true

# Continue game will just immeadietly load the last saved game.
func on_showContinueGame():
	print("TODO: Continue Game.")

func on_openDungeon():
	setScene(dungeonScene)

func on_openTown():
	setScene(townScene)

func setScene(scene):
	var root = get_tree().get_current_scene()
	for child in root.get_children():
		root.remove_child(child)
	root.add_child(scene)
