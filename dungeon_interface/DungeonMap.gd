extends Node2D

const MapMargin = 20
const BottomMargin = 120

const normalFloorColor = Color(0.12, 0.11, 0.10)
const waterFloorColor = Color(0.20, 0.30, 0.50)
const normalWallColor = Color(0.85, 0.82, 0.80)

var tileSize = 40
var wallWidth = 4.0

var centerIndex:DungeonIndex
var viewSize:Vector2
var mapBounds:Rect2
var mapCenter:Vector2



func _draw():
	drawFrame()
	drawTiles()

func drawFrame():
	var viewSize = get_viewport_rect().size
	var rectum = Rect2(MapMargin,MapMargin,viewSize.x-(MapMargin*2),viewSize.y-MapMargin-BottomMargin)

	var backgroundColor = Color(0.21, 0.2, 0.2)
	var edgeColor = Color(0.75, 0.7, 0.7)

	drawShadow(rectum)
	draw_rect(rectum, backgroundColor, true)
	draw_rect(rectum, edgeColor, false, 1)

func drawTiles():
	centerIndex = GameState.partyLocation
	viewSize = get_viewport_rect().size

	mapBounds = Rect2(Vector2(MapMargin,MapMargin),Vector2(
		viewSize.x - (MapMargin*2),
		viewSize.y - MapMargin - BottomMargin
	))

	mapCenter = Vector2(
		(mapBounds.size.x / 2.0) + MapMargin,
		(mapBounds.size.y / 2.0) + MapMargin)

	var xTileCount = ceili(mapBounds.size.x / tileSize)
	var yTileCount = ceili(mapBounds.size.y / tileSize)
	var corner = Vector2(
		centerIndex.index.x - (xTileCount/2),
		centerIndex.index.y - (yTileCount/2))

# Something is fucked up, the map isn't being drawn in the center for some reason.
# Also, some tiles that should not be null are null. Always in the NW corner for some reason.
# Something must be broken in the chunk loader.

#	print("Map Bounds:",mapBounds)
#	print("Map Center:",mapCenter)
#	print("   X Tiles:",xTileCount)
#	print("   Y Tiles:",yTileCount)
#	print("Corner",corner)

	for y in range(corner.y, corner.y + yTileCount):
		for x in range(corner.x, corner.x + xTileCount):
			var thisIndex = DungeonIndex.new(x,y,centerIndex.index.z)
			var chunk = Dungeon.fetchChunk(thisIndex.chunkIndex())

			var tile = null
			if chunk:
				tile = chunk.getTile(thisIndex.tileIndex())
			if tile:
				drawTile(tile,Vector2(
					mapCenter.x + (x * tileSize),
					mapCenter.y + (y * tileSize)))

			if thisIndex.index.x == 9 and thisIndex.index.y == 2:
				print("???",tile)




func drawTile(tile,center):
	var corners = createCornerMap(center)
	draw_rect(corners.bounds, tileFloorColor(tile), true)

	for facing in Constants.NSEW:
		var wall = tile.wallAt(facing)
		if wall:
			printWall(corners, facing, wall)

func printWall(corners, facing, wall):
	if facing == Constants.North:
		draw_line(corners.nw, corners.ne, normalWallColor, wallWidth)
	if facing == Constants.South:
		draw_line(corners.sw, corners.se, normalWallColor, wallWidth)
	if facing == Constants.East:
		draw_line(corners.ne, corners.se, normalWallColor, wallWidth)
	if facing == Constants.West:
		draw_line(corners.nw, corners.nw, normalWallColor, wallWidth)

func tileFloorColor(tile):
	if tile.theFloor.type == Floor.Type.Water:
		return waterFloorColor
	return normalFloorColor




# All this shit looks like something that would make a handy utility function as well. I'm making a
# map of all the corners in a rectangle, and I'm clamping their coordinates to fall inside their
# parent's bounds. I need both bounds and corners because lines are drawn with corners and
# rectangles are drawn with bounds.
func createCornerMap(centerPoint):
	var corners = {}
	var map_n = mapBounds.position.y
	var map_s = mapBounds.position.y + mapBounds.size.y - 1
	var map_e = mapBounds.position.x
	var map_w = mapBounds.position.x + mapBounds.size.x - 1

	corners.nw = Vector2(
		clamp(centerPoint.x - (tileSize/2), map_e, map_w),
		clamp(centerPoint.y - (tileSize/2), map_n, map_s))
	corners.ne = Vector2(
		clamp(corners.nw.x + tileSize, map_e, map_w),
		clamp(corners.nw.y, map_n, map_s))
	corners.se = Vector2(
		clamp(corners.ne.x, map_e, map_w),
		clamp(corners.ne.y + tileSize, map_n, map_s))
	corners.sw = Vector2(
		clamp(corners.nw.x, map_e, map_w),
		clamp(corners.se.y, map_n, map_s))

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
