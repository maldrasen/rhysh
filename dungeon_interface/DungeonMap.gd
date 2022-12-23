extends Node2D

const MapMargin = 20
const BottomMargin = 120

const normalFloorColor = Color(0.20, 0.20, 0.20)
const waterFloorColor =  Color(0.20, 0.30, 0.50)
const normalWallColor =  Color(0.85, 0.82, 0.80)
const backgroundColor =  Color(0.10, 0.10, 0.10)
const frameColor =       Color(0.05, 0.05, 0.05)
const edgeColor =        Color(0.75, 0.75, 0.75)

# Scale
var mapScales = {
	1: { "tileSize":10,  "wallWidth":1.0 },
	2: { "tileSize":20,  "wallWidth":2.0 },
	3: { "tileSize":30,  "wallWidth":3.0 },
	4: { "tileSize":50,  "wallWidth":4.0 },
	5: { "tileSize":80,  "wallWidth":6.0 },
}
var mapScale = 3
var tileSize = mapScales[mapScale].tileSize
var wallWidth = mapScales[mapScale].wallWidth

# Bounds
var centerIndex:DungeonIndex
var viewSize:Vector2
var mapBounds:Rect2
var mapCenter:Vector2

func _input(_event):
	if Input.is_action_just_pressed("scale_up"):
		setScale(clamp(mapScale-1, 1, 5))
	if Input.is_action_just_pressed("scale_down"):
		setScale(clamp(mapScale+1, 1, 5))

func setScale(scale):
	print("Set Scale:",scale)
	mapScale = scale
	tileSize = mapScales[scale].tileSize
	wallWidth = mapScales[scale].wallWidth
	queue_redraw()

func _draw():
	calculateBounds()
	drawBackground()
	drawTiles()
	drawFrame()

func calculateBounds():
	centerIndex = GameState.partyLocation
	viewSize = get_viewport_rect().size

	mapBounds = Rect2(Vector2(MapMargin,MapMargin),Vector2(
		viewSize.x - (MapMargin*2),
		viewSize.y - MapMargin - BottomMargin))

	mapCenter = Vector2(
		(mapBounds.size.x / 2.0) + MapMargin,
		(mapBounds.size.y / 2.0) + MapMargin)

func drawBackground():
	draw_rect(mapBounds, backgroundColor, true)

# Draw a frame around the map. This is really just faking out clipping by drawing an opaque frame
# on top of the map, while making it look like a background.
func drawFrame():
	draw_rect(Rect2(Vector2(0,0),Vector2(viewSize.x,MapMargin)),frameColor,true)
	draw_rect(Rect2(Vector2(0,0),Vector2(MapMargin,viewSize.y)),frameColor,true)

	draw_rect(Rect2(
		Vector2(viewSize.x - MapMargin,0),
		Vector2(MapMargin, viewSize.y)
	),frameColor,true)

	draw_rect(Rect2(
		Vector2(0,viewSize.y - BottomMargin),
		Vector2(viewSize.x, BottomMargin)
	),frameColor,true)

	draw_rect(mapBounds, edgeColor, false, 1)
	drawShadow(mapBounds)

# Something is seriously messed up. There are no west walls, and the tiles are blank whenever there
# should be a North West corner...

func drawTiles():
	var xTileCount = ceili(mapBounds.size.x / tileSize) + 1
	var yTileCount = ceili(mapBounds.size.y / tileSize) + 1
	var corner = Vector2(
		centerIndex.index.x - (xTileCount/2),
		centerIndex.index.y - (yTileCount/2))

	for y in range(corner.y, corner.y + yTileCount):
		for x in range(corner.x, corner.x + xTileCount):
			var tileCenter = Vector2(
				mapCenter.x + (x - centerIndex.index.x) * tileSize,
				mapCenter.y + (y - centerIndex.index.y) * tileSize)

			var thisIndex = DungeonIndex.new(x,y,centerIndex.index.z)
			var chunk = Dungeon.fetchChunk(thisIndex.chunkIndex())
			var tile = null

			if chunk:
				tile = chunk.getTile(thisIndex.tileIndex())
			if tile:
				drawTile(tile,tileCenter)

func drawTile(tile,center):
	var corners = createCornerMap(center)
	draw_rect(corners.bounds, tileFloorColor(tile), true)

	for facing in Constants.NSEW:
		var wall = tile.wallAt(facing)
		if wall:
			printWall(corners, facing, wall)

func printWall(corners, facing, wall):
	if facing == Constants.North:
		draw_line(corners.nw, corners.ne, Color.CRIMSON, wallWidth)
	if facing == Constants.South:
		draw_line(corners.sw, corners.se, Color.BLUE, wallWidth)
	if facing == Constants.East:
		draw_line(corners.ne, corners.se, Color.CRIMSON, wallWidth)
	if facing == Constants.West:
		draw_line(corners.nw, corners.nw, Color.BLUE, wallWidth)

func tileFloorColor(tile):
	if tile.theFloor.type == Floor.Type.Water:
		return waterFloorColor
	return normalFloorColor

# All this shit looks like something that would make a handy utility function as well. I'm making a
# map of all the corners in a rectangle, and I'm clamping their coordinates to fall inside their
# parent's bounds. I need both bounds and corners because lines are drawn with corners and
# rectangles are drawn with bounds.
func createCornerMap(centerPoint:Vector2):
	var corners = {}
	var map_n = mapBounds.position.y
	var map_s = mapBounds.position.y + mapBounds.size.y - 1
	var map_e = mapBounds.position.x
	var map_w = mapBounds.position.x + mapBounds.size.x - 1

	corners.nw = Vector2(
		centerPoint.x - (tileSize/2),
		centerPoint.y - (tileSize/2))
	corners.ne = Vector2(
		corners.nw.x + tileSize,
		corners.nw.y)
	corners.se = Vector2(
		corners.ne.x,
		corners.ne.y + tileSize)
	corners.sw = Vector2(
		corners.nw.x,
		corners.se.y)

	corners.bounds = Rect2(
		corners.nw.x,
		corners.nw.y,
		corners.ne.x-corners.nw.x,
		corners.sw.y-corners.nw.y)

	return corners

# Move this into a general UI library? Or are we going to be working with a sliced texture UI and
# shouldn't even bother?
func drawShadow(rectum:Rect2, size:int=20, shade:float=0.9, attenuation:float=0.2):
	var x = rectum.position.x
	var y = rectum.position.y
	var w = rectum.size.x
	var h = rectum.size.y

	var topRight = Vector2(x+w,y)
	var bottomRight = Vector2(x+w,y+h)
	var bottomLeft = Vector2(x,y+h)

	for i in range(1,size):
		shade *= (1.0 - attenuation)
		var shadow = Color(0,0,0,shade)
		var move = Vector2(i,i)
		draw_line(topRight+move, bottomRight+move, shadow, 0.5, true)
		draw_line(bottomRight+move, bottomLeft+move, shadow, 0.5, true)
