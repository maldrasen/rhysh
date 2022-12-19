extends Control

# ready() will need to create a selectable element for each saved game.
func _ready():
	pass

# Go back to the main menu.
func _on_back_pressed():
	Signals.showMainMenu.emit()
	
# Load a game. Need to first have a game selected though.
func _on_load_pressed():
	print("Load Game")

