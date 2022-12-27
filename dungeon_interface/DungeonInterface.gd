extends Node

var mapView:MapView

func _ready():
	mapView = MapView.new($MapContainer, {
		"mapSize": "Full",
		"mapAnchor": "Center",
		"mapMargin": 60	})

func _input(event):
	mapView.onInput(event)

func _process(_delta):
	mapView.checkSize()
