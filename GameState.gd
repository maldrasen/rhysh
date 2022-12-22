extends Node

var stage
var partyLocation
var partyFacing

const GameStatePath = "user://worlds/{0}/gameState.json"

const SavableStateMapping = {
	Constants.GameStage.Dungeon:    true,
	Constants.GameStage.Town:       true,
	Constants.GameStage.TownGuild:  true,
	Constants.GameStage.TownStore:  true,
	Constants.GameStage.TownTavern: true,
}

func _ready():
	Signals.quickSaveGame.connect(on_quickSave)
	Signals.quickLoadGame.connect(on_quickLoad)

func on_quickSave():
	if gameCanSave():
		saveGame()

func on_quickLoad():
	if Configuration.lastGame and gameCanLoad():
		loadGame(Configuration.lastGame)

func gameCanSave():
	if stage == null:
		return false
	return SavableStateMapping[stage] == true

func gameCanLoad():
	return true

func saveGame():
	var stateObject = {
		"stage": stage,
		"partyLocation": partyLocation,
		"partyFacing": partyFacing,
	}

	# TODO: Switch this over to a binary format once we start adding a ton of character data and
	#       whatnot. JSON is fine for now as it's nice to have something human readable to debug.
	var path = GameStatePath.format([Configuration.currentWorldDirectory])
	FileAccess.open(path, FileAccess.WRITE).store_line(JSON.stringify(stateObject))

func loadGame(world):
	Configuration.currentWorldDirectory = world
	Configuration.saveConfiguration()

	var path = GameStatePath.format([world])
	var savedState = JSON.parse_string(FileAccess.get_file_as_string(path))

	self.stage = savedState.stage
	self.partyFacing = savedState.partyFacing
	self.partyLocation = savedState.partyLocation

	if stage == Constants.GameStage.Dungeon:
		Signals.openDungeon.emit()
	if stage == Constants.GameStage.Town:
		Signals.openTown.emit()
