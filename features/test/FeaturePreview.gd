extends Control

var mapView:MapView

# This scene is really just to test the Feature generation.
# It doesn't actually go into the game at all.

func _ready():
	loadZone("Wolgur")

# Load Zone is a bit heavy handed right now. To make it work with the map I had to make a game in
# order to build the zone correctly. MapView is going to need some updates though, so I'll make it
# work without a game when that get updated.
func loadZone(name):
	GameState.createWorld()
	Dungeon.loadZone("Wolgur")
	GameState.updateOrigin("Guild")
	GameState.saveGame()

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
	mapView.onInput(event)

func _process(_delta):
	mapView.checkSize()
