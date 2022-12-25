extends Control

var mapView:MapView

func _ready():
	mapView = MapView.new($MapContainer, {
		"tileSourceType": "FeatureTemplate",
		"tileSource": FeatureLibrary.lookup("Origin"),
		"mapSize": "Full",
		"mapMargin": 60
	})

func _input(event):
	mapView.onInput(event)

func _process(_delta):
	mapView.checkSize()
