extends Node2D

const MapMargin = 20
const BottomMargin = 120

const normalFloorColor = Color(0.20, 0.20, 0.20)
const waterFloorColor =  Color(0.20, 0.25, 0.30)
const wallColorA =       Color(0.90, 0.90, 0.90)
const wallColorB =       Color(0.50, 0.50, 0.50)
const backgroundColor =  Color(0.10, 0.10, 0.10)
const frameColor =       Color(0.05, 0.05, 0.05)
const edgeColor =        Color(0.75, 0.75, 0.75)

# Scale
var mapScales = {
	1: { "tileSize":20,  "wallWidth":2.0 },
	2: { "tileSize":30,  "wallWidth":3.0 },
	3: { "tileSize":50,  "wallWidth":4.0 },
	4: { "tileSize":80,  "wallWidth":6.0 },
}
var mapScale = 3
var tileSize = mapScales[mapScale].tileSize
var wallWidth = mapScales[mapScale].wallWidth

# Offset
var offset = Vector3i(0,0,0)

# Bounds
var centerIndex:DungeonIndex
var viewSize:Vector2
var mapBounds:Rect2
var mapCenter:Vector2


func calculateBounds():
	centerIndex = GameState.partyLocation.translate(offset)
	viewSize = get_viewport_rect().size

	mapBounds = Rect2(Vector2(MapMargin,MapMargin),Vector2(
		viewSize.x - (MapMargin*2),
		viewSize.y - MapMargin - BottomMargin))

	mapCenter = Vector2(
		(mapBounds.size.x / 2.0) + MapMargin,
		(mapBounds.size.y / 2.0) + MapMargin)



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
			drawWall(corners, facing, wall)

func drawWall(corners, facing, wall):
	if facing == Constants.North:
		draw_line(corners.nw, corners.ne, wallColorA, wallWidth)
	if facing == Constants.South:
		draw_line(corners.sw, corners.se, wallColorB, wallWidth)
	if facing == Constants.East:
		draw_line(corners.ne, corners.se, wallColorB, wallWidth)
	if facing == Constants.West:
		draw_line(corners.nw, corners.sw, wallColorA, wallWidth)

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

	var margin = 3

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

	# Apply margin after defining bounds
	corners.nw.x += margin
	corners.nw.y += margin
	corners.ne.x += -margin
	corners.ne.y += margin
	corners.se.x += -margin
	corners.se.y += -margin
	corners.sw.x += margin
	corners.sw.y += -margin

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
