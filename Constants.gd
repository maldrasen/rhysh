extends Node

const WINDOW_SIZE = Vector2(1280,720)
const CHUNK_SIZE = 32

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
