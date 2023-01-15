extends Control

var mapView:MapView

func _ready():
	loadZone("WolgurCleft","Wolgur")

func loadZone(zoneName, origin):
	GameState.createWorld()
	Dungeon.loadZone(zoneName)
	GameState.updateOrigin(origin)
	GameState.saveGame()

	mapView = MapView.new($MapContainer, {
		"mapSize": "Full",
		"mapAnchor": "Center",
		"mapMargin": 60	})

func _input(event):
	if mapView:
		mapView.onInput(event)

func _process(_delta):
	if mapView:
		mapView.checkSize()