extends Node

enum Anchor { Bottom, Center }

# The game stage is mostly needed because when we save a game we need to know 
# what stage to start back in. This may also be used when transitioning from 
# one stage to another, in case something needs to happen.
enum GameStage {
	Town,
	TownGuild,
	TownTavern,
	TownStore,
	Dungeon
}
