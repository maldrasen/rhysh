extends Node

func _ready():
	DisplayServer.window_set_min_size(Vector2(1808,1024))
	Signals.showMainMenu.connect(on_showMainMenu)
	Signals.showNewGame.connect(on_showNewGame)
	Signals.showLoadGame.connect(on_showLoadGame)
	Signals.showContinueGame.connect(on_showContinueGame)
	Signals.showConfiguration.connect(on_showConfiguration)

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
	print("Continue Game.")
