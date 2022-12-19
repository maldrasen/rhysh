extends Node

enum Anchor { Bottom, Center }

enum GameStage {
	Town,
	TownGuild,
	TownTavern,
	TownStore,
	Dungeon
}

func _ready():
	print("Loading Constants...")
