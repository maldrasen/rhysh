extends Node

class_name MapView

# Colors
const backgroundColor =  Color(0.10, 0.10, 0.10)

# Sources
var parent:Control
var properties

# Bounds
var viewSize
var mapSize

# Components
var background:ColorRect
var viewportContainer:SubViewportContainer
var viewport:SubViewport

# Sections
var mapSections = {}

# Scale
var mapScales = {
	1: { "tileSize":10,  "wallWidth":1.0 },
	2: { "tileSize":16,  "wallWidth":1.0 },
	3: { "tileSize":22,  "wallWidth":2.0 },
	4: { "tileSize":30,  "wallWidth":3.0 },
	5: { "tileSize":38,  "wallWidth":4.0 },
	6: { "tileSize":48,  "wallWidth":5.0 },
	7: { "tileSize":60,  "wallWidth":6.0 },
}
var mapScale = 2
var tileSize = mapScales[mapScale].tileSize
var wallWidth = mapScales[mapScale].wallWidth

# Position
var offset = Vector2(0,0)
var centerIndex
var centerChunkIndex
var centerTileIndex



# We need the map to work in the dungeon and on individual features or chunks and should work as
# both a minimap and an actual map. The properties control where the map is drawn and what this map
# displays. Properties:
#
#   mapAnchor: "Center","NE","NW","SE","SW" (though only NE and Center have been written)
#   mapSize:   "Full" or a Vector2i for some other size.
#   mapMargin: Either a single int for the same margins or a dictionary {N,S,E,W}
#   tileSource: Can be a Chunk, a FeatureTemplate, or null to use the dungeon as the source.
#
# The scene also must have a container named MapContainer to put the map into.
func _init(parent_, properties_):
	self.properties = properties_
	self.parent = parent_

	if !properties.has("tileSource"):
		centerIndex = GameState.partyLocation
		centerChunkIndex = centerIndex.chunkIndex()
		centerTileIndex = centerIndex.tileIndex()

	buildComponents()
	setBounds()
	buildSingleSection()

	parent.resized.connect(setBounds)
	parent.add_child(viewportContainer)

func onInput(_event):

	if Input.is_action_just_pressed("scale_up"):
		setScale(clamp(mapScale-1, 1, 7))
	if Input.is_action_just_pressed("scale_down"):
		setScale(clamp(mapScale+1, 1, 7))

	if Constants.DebugMode:
		var moved = false

		if Input.is_action_pressed("ui_page_up"):
			print("TODO: Move up")
		if Input.is_action_pressed("ui_page_down"):
			print("TODO: Move down")
		if Input.is_action_pressed("ui_left"):
			offset += Vector2(1,0)
			moved = true
		if Input.is_action_pressed("ui_right"):
			offset += Vector2(-1,0)
			moved = true
		if Input.is_action_pressed("ui_up"):
			offset += Vector2(0,1)
			moved = true
		if Input.is_action_pressed("ui_down"):
			offset += Vector2(0,-1)
			moved = true

		if moved:
			buildDungeonSections()
			positionSections()

func setScale(scale):
	mapScale = scale
	tileSize = mapScales[mapScale].tileSize
	wallWidth = mapScales[mapScale].wallWidth

	for i in mapSections:
		mapSections[i].setMapScale(mapScales[mapScale])

	buildDungeonSections()
	positionSections()

# Build the base viewport components.
func buildComponents():
	background = ColorRect.new()
	background.color = backgroundColor

	viewport = SubViewport.new()
	viewport.add_child(background)

	viewportContainer = SubViewportContainer.new()
	viewportContainer.add_child(viewport)

# This is kind of weird. If we know we're only displaying a single feature or a chunk we can create
# a map section with that chunk here and add it to the viewport. When displaying dungeon chunks
# though we need to ensure that we have enough chunks to display on the fullscreen map. Because the
# map size may change we need to figure out which chunks are needed any time the map is resized,
# scaled or panned.
func buildSingleSection():
	if properties.has("tileSource") == false:
		return

	if properties.tileSourceType == "FeatureTemplate":
		var section = MapSection.new(mapScales[mapScale])
		section.label = properties.tileSource.featureName
		section.tiles = properties.tileSource.tiles
		section.biomeAreas = properties.tileSource.biomeAreas

		mapSections[Vector2(0,0)] = section
		viewport.add_child(section)

	# Annoying to have to call this again, but
	# set bounds will recenter the section.
	setBounds()

# When building the dungeon sections we need to figure out when chunks will be shown on the map and
# build sections for those chunks.
@warning_ignore(integer_division)
func buildDungeonSections():

	# A map for a single chunk or feature will have a tile source set and this
	# will not be applicable.
	if properties.has("tileSource"):
		return

	var sectionSize = tileSize * Constants.ChunkSize
	var chunks_x = ceili(mapSize.x / sectionSize) + 1
	var chunks_y = ceili(mapSize.y / sectionSize) + 1

	var offset_x = floor(offset.x / Constants.ChunkSize) * -1
	var offset_y = floor(offset.y / Constants.ChunkSize) * -1

	var min_x = centerChunkIndex.x - ceili(chunks_x/2) + offset_x - 1
	var min_y = centerChunkIndex.y - ceili(chunks_y/2) + offset_y - 1
	var max_x = min_x + chunks_x + 2
	var max_y = min_y + chunks_y + 2

	for y in range(min_y, max_y):
		for x in range(min_x, max_x):
			if mapSections.has(Vector2(x,y)) == false:

				var chunk = Dungeon.fetchChunk(Vector3i(x,y,centerChunkIndex.z))
				var section = MapSection.new(mapScales[mapScale])

				if chunk:
					section.label = chunk.to_string()
					section.tiles = chunk.tiles
				if chunk == null:
					section.label = "Empty({0},{1},{2})".format([x,y,centerChunkIndex.z])

				mapSections[Vector2(x,y)] = section
				viewport.add_child(section)

	for index in mapSections:
		var x1 = index.x < min_x
		var x2 = index.x > max_x
		var y1 = index.y < min_y
		var y2 = index.y > max_y
		if x1 or x2 or y1 or y2:
			mapSections.erase(index)


# This is a bit of a hack until I figure out why the resize events are fucking broken. Sometimes
# the resize events just don't fire, so you end up with a fucked up map. Not sure what else I can
# do other than assert the container sizes like this. This happens a lot when the window is being
# resized.
func checkSize():
	var containerWrong = parent.get_viewport_rect().size != viewSize
	var viewportWrong = viewportContainer.size != mapSize
	var backgroundWrong = background.size != mapSize

	if containerWrong or viewportWrong or backgroundWrong:
		setBounds()

# Determine the important sizes and positions for the map. This is a little buggy, but I think it's
# a Godot problem. Sometimes the window, after it's been maximized, stops sending resize events.
# I've tried adding a hack to the input event to check the size, but that only kind of works. I'm
# tempted to just delete the nodes while the window is resizing and rebuild everything after it's
# done.
func setBounds():
	viewSize = parent.get_viewport_rect().size
	mapSize = getMapSize()

	parent.set_size(mapSize)
	parent.set_position(getMapViewOffset())

	viewportContainer.reset_size()

	viewportContainer.set_size(mapSize)
	background.set_size(mapSize)
	viewport.set_size(mapSize)

	buildDungeonSections()
	positionSections()

# Because the map is drawn onto the sections to move around we only need to set the position of the
# sections. This is also called when the window is resized to move the sections pack into the
# correct position.
func positionSections():
	var sectionSize = tileSize * Constants.ChunkSize

	for sectionLocation in mapSections:
		viewport.remove_child(mapSections[sectionLocation])

	for sectionLocation in mapSections:
		var section = mapSections[sectionLocation]
		var location_x = sectionLocation.x
		var location_y = sectionLocation.y

		if properties.has("tileSource") == false:
			location_x -= centerChunkIndex.x
			location_y -= centerChunkIndex.y

		section.position = Vector2(
			(mapSize.x - sectionSize)/2 + (location_x * sectionSize) + (offset.x * tileSize),
			(mapSize.y - sectionSize)/2 + (location_y * sectionSize) + (offset.y * tileSize))

		viewport.add_child(section)

# Use the map size and margins to determine where on the screen it needs to be positioned. If it
# hasn't been set it anchors the map to the NW corner. For the full size map it doesn't really
# matter what the anchor is set to as it will be anchored to all the corners. This could probably
# also take a Vector2 as an argument to just set it's position directly, but that wouldn't be
# properly repositioned when the screen is resized if so.
func getMapViewOffset():
	var margins = getMapMargins()
	if properties.has("mapAnchor") == false:
		properties.mapAnchor = "NW"

	if properties.mapAnchor == "Center":
		return Vector2(
			viewSize.x - mapSize.x - (margins.E + margins.W)/2,
			viewSize.y - mapSize.y - (margins.N + margins.S)/2)
	if properties.mapAnchor == "NE":
		return Vector2(
			viewSize.x - mapSize.x - margins.E,
			margins.N
		)
	if properties.mapAnchor == "NW":
		return Vector2(margins.N,margins.W)

# The mapSize property could have been set to "Full" when this is the case we just want to use the
# viewport size minus the margin sizes for the map size. The mapSize could also have been set to a
# size in which case we just use that.
func getMapSize():
	var margins = getMapMargins()

	if typeof(properties.mapSize) == TYPE_STRING and properties.mapSize == "Full":
		return Vector2(
			clamp(viewSize.x - margins.E - margins.W,10,100000),
			clamp(viewSize.y - margins.N - margins.S,10,100000))

	return properties.mapSize

# Get the map margins from the properties. They could have been set to a single int, a map of
# directions to margin values, or left unset.
func getMapMargins():
	if properties.has("mapMargin") == false:
		properties.mapMargin = 0

	if typeof(properties.mapMargin) != TYPE_INT:
		return properties.mapMargin

	return {
		"N":properties.mapMargin,
		"S":properties.mapMargin,
		"E":properties.mapMargin,
		"W":properties.mapMargin}
