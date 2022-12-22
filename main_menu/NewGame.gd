extends Control

func _on_back_pressed():
	Signals.showMainMenu.emit()

# Right now we start a new game as soon as the button is pressed. We will want to add some
# separation there eventually to check to see if the player name and shit has been set.
func _on_new_game_pressed():
	Signals.startNewGame.emit()
