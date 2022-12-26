extends Control

var mapView:MapView

func _ready():

	var houses = FeatureLibrary.featureSets["houses"]
	var featureName = houses.pick_random()
	var feature = FeatureLibrary.lookup(featureName)

	print("Showing: ",featureName)

	mapView = MapView.new($MapContainer, {
		"tileSourceType": "FeatureTemplate",
		"tileSource": feature,
		"mapSize": "Full",
		"mapMargin": 60
	})

func _input(event):
	mapView.onInput(event)

func _process(_delta):
	mapView.checkSize()
