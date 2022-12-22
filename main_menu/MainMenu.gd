extends Control

func _ready():
	if (Configuration.currentWorldDirectory == null):
		$CenterContainer/Continue.disabled = true

func _on_new_game_pressed():
	Signals.showNewGame.emit()

func _on_continue_pressed():
	Signals.showContinueGame.emit()

func _on_load_game_pressed():
	Signals.showLoadGame.emit()

func _on_configuration_pressed():
	Signals.showConfiguration.emit()

func _on_exit_pressed():
	get_tree().quit()
