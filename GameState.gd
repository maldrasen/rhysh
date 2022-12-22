extends Node

const WorldsPath = "user://worlds"
const GameStatePath = "user://worlds/{0}/gameState.json"

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
var partyLocation
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

	partyLocation = DungeonIndex.new(7,7,0)
	partyFacing = Constants.South

	# Create a directory for the world.
	DirAccess.open(WorldsPath).make_dir(currentWorld)

	# Update the global configuration
	Configuration.worldCounter += 1;
	Configuration.setLastPlayedWorld(currentWorld)

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
	print("=== Saving Game ===")

	saveDate = Time.get_datetime_string_from_system()

	var stateObject = {
		"createDate": createDate,
		"saveDate": saveDate,
		"randomSeed": randomSeed,
		"stage": stage,
		"partyLocation": partyLocation._to_string(),
		"partyFacing": partyFacing,
	}

	var path = GameStatePath.format([currentWorld])
	FileAccess.open(path, FileAccess.WRITE).store_line(JSON.stringify(stateObject))

func loadGame(world):
	Configuration.setLastPlayedWorld(world)

	var path = GameStatePath.format([world])
	var savedState = JSON.parse_string(FileAccess.get_file_as_string(path))

	self.currentWorld = world
	self.createDate = savedState.createDate
	self.saveDate = savedState.saveDate
	self.randomSeed = savedState.randomSeed
	self.stage = savedState.stage
	self.partyFacing = savedState.partyFacing
	self.partyLocation = DungeonIndex.fromString(savedState.partyLocation)

	if stage == Constants.GameStage.Dungeon:
		Signals.openDungeon.emit()
	if stage == Constants.GameStage.Town:
		Signals.openTown.emit()
