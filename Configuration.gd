extends Node

# The Configuration needs to read and parse the user configuration file. If it
# doesn't exist one needs to be created at the root with the default values.
# Then we need to look up all of the current saved games and read all of their 
# world configurations. 

# Godot has its own built in config file format, so might as well use that:
#    https://docs.godotengine.org/en/stable/classes/class_configfile.html

const CONFIG_PATH = "user://rhysh.cfg"
const WORLDS_PATH = "user://worlds/"

var gameCongifuration
var worldConfigurations = []

var world_counter
var last_game

# Load or create the global configuration file.
func _ready():
	gameCongifuration = ConfigFile.new()
	
	if (gameCongifuration.load(CONFIG_PATH) != OK):
		createConfiguration()
	
	for section in gameCongifuration.get_sections():
		if (section == "Rhysh"):
			world_counter = gameCongifuration.get_value(section, "world_counter")

	# Now, read all of the world configuration files. If the worlds directory 
	# does't exist this is probably the first run of the app and we need to 
	# create it.
	var userDirectory = DirAccess.open("user://")
	if (userDirectory.file_exists("worlds") == false):
		userDirectory.make_dir("worlds")

	var worldDirectory = DirAccess.open(WORLDS_PATH)
	for world in worldDirectory.get_directories():
		add_world_configuration(world)

# Create the default configuration file.
func createConfiguration():
	gameCongifuration = ConfigFile.new()
	gameCongifuration.set_value("Rhysh","world_counter",1)
	gameCongifuration.save(CONFIG_PATH)

# Add this world to the list of world configurations.
func add_world_configuration(world):
	print("TODO: Read world config file")
