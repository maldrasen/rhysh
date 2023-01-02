extends Control

var mapView:MapView

# This scene is really just to test the Feature generation.
# It doesn't actually go into the game at all.

func _ready():
	loadZone("Wolgur")

# You can only load a zone if there's a current game loaded because when loaded a zone either reads
# the existing chunk files in the world, or writes them when it's loaded the first time.
func loadZone(name):
	if Configuration.lastPlayedWorld == null:
		return printerr("Cannot preview zone. There is no world to continue from.")

	GameState.loadGame(Configuration.lastPlayedWorld)
	Dungeon.loadZone("Wolgur")
	GameState.updateOrigin("Guild")

	mapView = MapView.new($MapContainer, {
		"mapSize": "Full",
		"mapAnchor": "Center",
		"mapMargin": 60	})

# TODO: Make this work for features again.
	# Set feature type to "Feature" or "FeatureTemplate"
#	var featureType = "Feature"
#	var featureName
#	var feature
#
#	if featureType == "Feature":
#		featureName = FeatureLibrary.featureSets["gardens"].pick_random()
#		feature = Feature.new(featureName)
#		feature.randomFlip()
#
#	if featureType == "FeatureTemplate":
#		featureName = "Origin"
#		feature = FeatureLibrary.lookup(featureName)
#
#	print("Showing: ",featureName)
#	mapView = MapView.new($MapContainer, {
#		"tileSourceType": featureType,
#		"tileSource": feature,
#		"mapSize": "Full",
#		"mapMargin": 60
#	})
#
#	if featureType == "Feature":
#		mapView.offset.x = floor((Constants.ChunkSize - feature.size.x)/2)
#		mapView.offset.y = floor((Constants.ChunkSize - feature.size.y)/2)
#		mapView.setScale(5)
#		mapView.positionSections()

func _input(event):
	if mapView:
		mapView.onInput(event)

func _process(_delta):
	if mapView:
		mapView.checkSize()
