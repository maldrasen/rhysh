extends Control

var mapView:MapView

func _ready():
	loadMap()

func loadMap():
	loadRandomFeature()
#	loadRandomFeatureFromSet("farms")
#	loadFeature("Farm-1-6")

func loadRandomFeature():
	loadFeature(MapData.featureLibrary.keys().pick_random())

func loadRandomFeatureFromSet(setName):
	loadFeature(MapData.featureSets[setName].pick_random())

func loadFeature(featureName):
	print("Preview:",featureName)

	var feature = Feature.new(featureName)
	var chunkSource = { "name":featureName, "layers":[] }

	var offset = Vector2i(
		floor((Constants.ChunkSize - feature.size.x)/2),
		floor((Constants.ChunkSize - feature.size.y)/2))

	feature.randomFlip()

	for z in feature.size.z:
		var chunk = Chunk.new("Preview", Vector3i(0,0,z))
		for y in feature.size.y:
			for x in feature.size.x:
				chunk.setTile(Vector2i(x + offset.x, y + offset.y), feature.getTile(x,y,z))
		chunkSource.layers.push_back(chunk)

	mapView = MapView.new($MapContainer, {
		"tileSourceType": "ChunkSource",
		"tileSource": chunkSource,
		"mapSize": "Full",
		"mapMargin": 60
	})
	mapView.setScale(5)
	mapView.positionSections()

func _input(event):
	if event.as_text() == "F5" && event.pressed:
		loadMap()

	if mapView:
		mapView.onInput(event)

func _process(_delta):
	if mapView:
		mapView.checkSize()
