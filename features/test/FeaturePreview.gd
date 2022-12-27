extends Control

var mapView:MapView

# This scene is really just to test the Feature generation.
# It doesn't actually go into the game at all.

func _ready():

	# Set feature type to "Feature" or "FeatureTemplate"
	var featureType = "Feature"
	var featureName
	var feature

	if featureType == "Feature":
		featureName = FeatureLibrary.featureSets["houses"].pick_random()
		feature = Feature.new(featureName)
		feature.randomFlip()

	if featureType == "FeatureTemplate":
		featureName = "Origin"
		feature = FeatureLibrary.lookup(featureName)

	print("Showing: ",featureName)
	mapView = MapView.new($MapContainer, {
		"tileSourceType": featureType,
		"tileSource": feature,
		"mapSize": "Full",
		"mapMargin": 60
	})

	if featureType == "Feature":
		mapView.offset.x = floor((Constants.ChunkSize - feature.size.x)/2)
		mapView.offset.y = floor((Constants.ChunkSize - feature.size.y)/2)
		mapView.setScale(5)
		mapView.positionSections()

func _input(event):
	mapView.onInput(event)

func _process(_delta):
	mapView.checkSize()
