extends Control

var mapView:MapView

func _ready():
	mapView = MapView.new(self, {
		"tileSourceType": "FeatureTemplate",
		"tileSource": FeatureLibrary.lookup("Origin"),
		"mapSize": "Full",
		"mapMargin": 60
	})
	add_child(mapView.viewportContainer)

func _input(event):
	mapView.onInput(event)

