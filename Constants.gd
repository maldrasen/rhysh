extends Node

# Game Properties
const WindowSize = Vector2(1280,720)
const DebugMode = true

# Game Paths
const ConfigPath = "user://rhysh.cfg"
const WorldsPath = "user://worlds"
const GameStatePath = "user://worlds/{0}/gameState.json"

# Dungeon Properties
const ChunkSize = 32
const MaxDepth = 20

# Enums and Reference Constants
const North = "N"
const South = "S"
const East = "E"
const West = "W"
const NSEW = ["N","S","E","W"]

enum Biome {
	DarkWood,
	Garden,
	LightForest,
	Ruins,
}

# The game stage is mostly needed because when we save a game we need to know
# what stage to start back in. This may also be used when transitioning from
# one stage to another, in case something needs to happen.
enum GameStage {
	Dungeon,
	Town,
	TownGuild,
	TownStore,
	TownTavern,
}
