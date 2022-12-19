extends Control

# This will need to set all the controls in the panel to whatever was loaded
# from the configuration.
func _ready():
	pass

func _on_back_pressed():
	Signals.showMainMenu.emit()

# Save will actually need to save the values before going back.
func _on_save_pressed():
	Signals.showMainMenu.emit()
