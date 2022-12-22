extends Node

const WindowSize = Vector2(1280,720)
const ChunkSize = 32

const North = "N"
const South = "S"
const East = "E"
const West = "W"

enum Anchor { Bottom, Center }

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
