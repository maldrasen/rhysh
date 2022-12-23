extends Node

# The Configuration needs to read and parse the user configuration file. If it
# doesn't exist one needs to be created at the root with the default values.

const CONFIG_PATH = "user://rhysh.cfg"

var worldCounter = 1
var lastPlayedWorld

# Load or create the global configuration file.
func _ready():
	var configFile = ConfigFile.new()

	if (configFile.load(CONFIG_PATH) != OK):
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
	configFile.save(CONFIG_PATH)

# Save the configuration when one of the properties has been updated.
func saveConfiguration():
	var configFile = ConfigFile.new()
	configFile.set_value("Rhysh","worldCounter",worldCounter)
	configFile.set_value("Rhysh","lastPlayedWorld",lastPlayedWorld)
	configFile.save(CONFIG_PATH)

# When we update the world we need to save the configuration file.
func setLastPlayedWorld(world):
	lastPlayedWorld = world
	saveConfiguration()
