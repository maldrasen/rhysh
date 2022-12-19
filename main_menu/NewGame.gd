extends Control

func _on_back_pressed():
	Signals.showMainMenu.emit()

func _on_new_game_pressed():
	print("=== New Game ===")
