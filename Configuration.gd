extends Node

# The Configuration needs to read and parse the user configuration file. If it
# doesn't exist one needs to be created at the root with the default values.
# Then we need to look up all of the current saved games and read all of their
# world configurations.

# Godot has its own built in config file format, so might as well use that:
#    https://docs.godotengine.org/en/stable/classes/class_configfile.html

const CONFIG_PATH = "user://rhysh.cfg"
const WORLDS_PATH = "user://worlds"

var worldCounter = 1
var worldConfigurations = {}

var currentWorldDirectory
var currentWorldConfiguration

# Load or create the global configuration file.
func _ready():
	var configFile = ConfigFile.new()

	if (configFile.load(CONFIG_PATH) != OK):
		createConfiguration()

	for section in configFile.get_sections():
		if (section == "Rhysh"):
			worldCounter = configFile.get_value(section, "worldCounter")
			currentWorldDirectory = configFile.get_value(section, "currentWorldDirectory")

	# Now, read all of the world configuration files. If the worlds directory
	# does't exist this is probably the first run of the app and we need to
	# create it.
	var userDirectory = DirAccess.open("user://")
	if (userDirectory.file_exists("worlds") == false):
		userDirectory.make_dir("worlds")

	var worldDirectory = DirAccess.open(WORLDS_PATH)
	for world in worldDirectory.get_directories():
		addWorldConfiguration(world)

	print("Configs:",worldConfigurations)

# Create the default configuration file.
func createConfiguration():
	var configFile = ConfigFile.new()
	configFile.set_value("Rhysh","worldCounter",worldCounter)
	configFile.save(CONFIG_PATH)

# Save the configuration when one of the properties has been updated.
func saveConfiguration():
	var configFile = ConfigFile.new()
	configFile.set_value("Rhysh","worldCounter",worldCounter)
	configFile.set_value("Rhysh","currentWorldDirectory",currentWorldDirectory)
	configFile.save(CONFIG_PATH)

# Create a directory for the world and the world configuration file when
# starting a new game. The file name pattern is:
#    user://worlds/world-x/world.cfg
func createWorld():
	var folder = "world-{0}".format([worldCounter])
	var createDate = Time.get_datetime_string_from_system()

	# Create a directory for the world.
	DirAccess.open(WORLDS_PATH).make_dir(folder)

	currentWorldDirectory = folder
	currentWorldConfiguration = {
		"createDate": createDate,
		"seed": createDate.hash()
	}

	# Save the initial configuration in that directory.
	saveWorldConfiguration()

	# Update the global configuration because the world count has changed.
	worldCounter += 1
	saveConfiguration()


func saveWorldConfiguration():
	var file = "{0}/{1}/world.cfg".format([WORLDS_PATH,currentWorldDirectory])
	var config = ConfigFile.new()

	config.set_value("World","createDate",currentWorldConfiguration.createDate)
	config.set_value("World","seed",currentWorldConfiguration.seed)
	config.save(file)

# Add this world to the dictionary of world configurations.
func addWorldConfiguration(world):
	var config = ConfigFile.new()
	config.load("{0}/{1}/world.cfg".format([WORLDS_PATH,world]))

	worldConfigurations[world] = {
		"createDate": config.get_value("World","createDate"),
		"seed": config.get_value("World","seed"),
	}
