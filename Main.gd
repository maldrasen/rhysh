extends Node

var dungeonThread
var dungeonScene = preload("res://dungeon_interface/DungeonInterface.tscn").instantiate()
var townScene = preload("res://town/Town.tscn").instantiate()

func _ready():
	DisplayServer.window_set_min_size(Constants.WINDOW_SIZE)

	# Game State
	Signals.startNewGame.connect(on_startNewGame)

	# Main Menu Controls
	Signals.showMainMenu.connect(on_showMainMenu)
	Signals.showNewGame.connect(on_showNewGame)
	Signals.showLoadGame.connect(on_showLoadGame)
	Signals.showContinueGame.connect(on_showContinueGame)
	Signals.showConfiguration.connect(on_showConfiguration)

	# Scene Swapping
	Signals.openTown.connect(on_openTown)
	Signals.openDungeon.connect(on_openDungeon)

# Global Input Events
func _input(event):
	if Input.is_action_just_pressed("quick_save"):
		Signals.quickSaveGame.emit()
	if Input.is_action_just_pressed("quick_load"):
		Signals.quickLoadGame.emit()

	# Not sure where else to do this. I tried emmitting a signal, but the signal was received in
	# the same dungeon thread which isn't allowed to clean itself up for some reason.
	if dungeonThread and !dungeonThread.is_alive():
		dungeonThread.wait_to_finish()
		dungeonThread = null
		print("[Dungeon Thread Cleanup]")


# We build a new dungeon as soon as we start a new game. This might take a while, there's a lot of
# writing files to disk and such, so we handle dungeon generation in a seperate thread,
func on_startNewGame():
	Signals.openTown.emit()
	Configuration.createWorld()
	dungeonThread = Thread.new()
	dungeonThread.start(buildNewDungeon)

func buildNewDungeon():
	DungeonBuilder.new(Configuration.currentWorldConfiguration.seed).buildNewDungeon()
	GameState.saveGame()

# ==== Navigating Between Scenes ===================================================================

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
	GameState.stage = Constants.GameStage.Dungeon
	setScene(dungeonScene)

func on_openTown():
	GameState.stage = Constants.GameStage.Town
	setScene(townScene)

func setScene(scene):
	var root = get_tree().get_current_scene()
	for child in root.get_children():
		root.remove_child(child)
	root.add_child(scene)
