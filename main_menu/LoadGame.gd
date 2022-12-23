extends Control

const LoadGameRow = preload("res://main_menu/LoadGameRow.tscn")

func refreshGameList():
	var list = get_tree().get_current_scene().find_child("LoadGameList")
	for row in list.get_children():
		list.remove_child(row)

	var worldDirectory = DirAccess.open(Constants.WorldsPath)
	for world in worldDirectory.get_directories():
		var path = Constants.GameStatePath.format([world])
		var state = JSON.parse_string(FileAccess.get_file_as_string(path))
		addRow(list,world,state)

func addRow(list,world,state):
	var row = LoadGameRow.instantiate()
	row.find_child("NameLabel").text = "[{0}]:{1}".format([world, state.saveDate])
	row.find_child("LoadButton").pressed.connect(loadGame.bind(world))
	list.add_child(row)

func loadGame(world):
	GameState.loadGame(world)

func _on_back_pressed():
	Signals.showMainMenu.emit()
