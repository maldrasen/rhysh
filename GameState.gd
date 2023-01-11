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
var random

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

	self.currentWorld = "world-{0}".format([Configuration.worldCounter])
	self.createDate = Time.get_datetime_string_from_system()
	self.randomSeed = createDate.hash()
	self.partyLocation = DungeonIndex.new(0,0,0)

	# Create a directory for the world.
	DirAccess.open(Constants.WorldsPath).make_dir(currentWorld)

	# Update the global configuration
	Configuration.worldCounter += 1;
	Configuration.setLastPlayedWorld(currentWorld)

	# Initialize the sector state in the Dungeon
	Dungeon.sectorCounter = 0
	Dungeon.sectorDictionary = {}

	# Save the initial game state
	saveGame()
	initRandom()

func initRandom():
	self.random = RandomNumberGenerator.new()
	self.random.seed = self.randomSeed

# Whenever the party moves from one zone into another we update the party location to the point
# where they enter the zone from. The code in this function is the name of the zone (or other some
# other value if they're being moved by an event or something) where they last were. The new point
# is found in the zoneData for their current zone which should have a list of places it's possible
# to come to the current zone from. (Or should at least have a "Default" value)
func updateOrigin(code):
	var zoneInfo = Dungeon.zoneInfo
	var origin

	if zoneInfo == null:
		return printerr("Cannot update origin, no zone has been loaded.")
	if zoneInfo.origins.has("Default"):
		origin = zoneInfo.origins["Default"]
	if zoneInfo.origins.has(code):
		origin = zoneInfo.origins[code]
	if origin == null:
		return printerr("Cannot update origin. No origin point found for {0} and no default was set.".format([code]))

	self.partyLocation = origin.index
	self.partyFacing = origin.facing

# ==== Saving and Loading ==========================================================================

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
		"createDate": self.createDate,
		"saveDate": self.saveDate,
		"randomSeed": self.randomSeed,
		"stage": self.stage,
		"partyLocation": self.partyLocation.pack(),
		"partyFacing": self.partyFacing,
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

	initRandom()
	Dungeon.unpack(savedState.dungeonState)

	if stage == Constants.GameStage.Dungeon:
		Signals.openDungeon.emit()
	if stage == Constants.GameStage.Town:
		Signals.openTown.emit()
