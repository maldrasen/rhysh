extends Node

const SavableStateMapping = {
	Constants.GameStage.Dungeon:    true,
	Constants.GameStage.Town:       true,
	Constants.GameStage.TownGuild:  true,
	Constants.GameStage.TownStore:  true,
	Constants.GameStage.TownTavern: true,
}

var currentWorld
var createDate
var saveDate
var randomSeed

var stage
var partyLocation:DungeonIndex
var partyFacing


func _ready():
	Signals.quickSaveGame.connect(on_quickSave)
	Signals.quickLoadGame.connect(on_quickLoad)

	# Ensure that the worlds directory exists.
	var userDirectory = DirAccess.open("user://")
	if (userDirectory.file_exists("worlds") == false):
		userDirectory.make_dir("worlds")

# Create a directory for the world and the gameState.json file when starting a new game. The file
# name pattern is:
#    user://worlds/world-x/gameState.json
func createWorld():
	print("== Create World ==")

	currentWorld = "world-{0}".format([Configuration.worldCounter])
	createDate = Time.get_datetime_string_from_system()
	randomSeed = createDate.hash()

	# Set the initial party location and facing. These are kinda magic numbers. The chunk index
	# comes from the Dungeon builder where it sets the origin feature. The tile index is from the
	# Origin.json tilemap, just where that origin point is on that map. These are both subject to
	# change if the origin feature changes at all.
	partyLocation = DungeonIndex.fromIndices(Constants.OriginChunk,Constants.OriginTile)
	partyFacing = Constants.South

	# Create a directory for the world.
	DirAccess.open(Constants.WorldsPath).make_dir(currentWorld)

	# Update the global configuration
	Configuration.worldCounter += 1;
	Configuration.setLastPlayedWorld(currentWorld)

	Dungeon.regionCounter = 0
	Dungeon.regionDictionary = {}

	# Save the initial game state
	saveGame()


func on_quickSave():
	if gameCanSave():
		saveGame()

func on_quickLoad():
	if GameState.currentWorld and gameCanLoad():
		loadGame(GameState.currentWorld)

func gameCanSave():
	if stage == null:
		return false
	return SavableStateMapping[stage] == true

func gameCanLoad():
	return true

func saveGame():
	print("[Saving Game]")

	saveDate = Time.get_datetime_string_from_system()

	var stateObject = {
		"createDate": createDate,
		"saveDate": saveDate,
		"randomSeed": randomSeed,
		"stage": stage,
		"partyLocation": partyLocation.pack(),
		"partyFacing": partyFacing,
		"dungeonState": Dungeon.pack(),
	}

	var path = Constants.GameStatePath.format([currentWorld])
	FileAccess.open(path, FileAccess.WRITE).store_line(JSON.stringify(stateObject))

func loadGame(world):
	Configuration.setLastPlayedWorld(world)

	var path = Constants.GameStatePath.format([world])
	var savedState = JSON.parse_string(FileAccess.get_file_as_string(path))

	self.currentWorld = world
	self.createDate = savedState.createDate
	self.saveDate = savedState.saveDate
	self.randomSeed = savedState.randomSeed
	self.stage = savedState.stage
	self.partyFacing = savedState.partyFacing
	self.partyLocation = DungeonIndex.unpack(savedState.partyLocation)

	Dungeon.unpack(savedState.dungeonState)

	if stage == Constants.GameStage.Dungeon:
		Signals.openDungeon.emit()
	if stage == Constants.GameStage.Town:
		Signals.openTown.emit()
