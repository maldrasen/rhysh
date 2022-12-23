extends Node

var worldCounter = 1
var lastPlayedWorld

# Load or create the global configuration file.
func _ready():
	var configFile = ConfigFile.new()

	if (configFile.load(Constants.ConfigPath) != OK):
		createConfiguration()

	for section in configFile.get_sections():
		if (section == "Rhysh"):
			worldCounter = configFile.get_value(section, "worldCounter")
			lastPlayedWorld = configFile.get_value(section, "lastPlayedWorld", "NOPE")

	# Godot's ConfigFile complains about null defaults.
	if lastPlayedWorld == "NOPE":
		lastPlayedWorld = null

# Create the default configuration file.
func createConfiguration():
	var configFile = ConfigFile.new()
	configFile.set_value("Rhysh","worldCounter",worldCounter)
	configFile.save(Constants.ConfigPath)

# Save the configuration when one of the properties has been updated.
func saveConfiguration():
	var configFile = ConfigFile.new()
	configFile.set_value("Rhysh","worldCounter",worldCounter)
	configFile.set_value("Rhysh","lastPlayedWorld",lastPlayedWorld)
	configFile.save(Constants.ConfigPath)

# When we update the world we need to save the configuration file.
func setLastPlayedWorld(world):
	lastPlayedWorld = world
	saveConfiguration()
