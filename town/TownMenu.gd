extends Control

func _on_dungeon_pressed():
	Signals.openDungeon.emit()
