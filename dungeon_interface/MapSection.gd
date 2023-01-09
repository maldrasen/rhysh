extends TextureRect

class_name MapSection

const BackgroundColor =   Color(0.10, 0.10, 0.10)
const NormalFloorColor =  Color(0.16, 0.155, 0.15)
const WaterFloorColor =   Color(0.20, 0.30, 0.40)
const VoidFloorColor =    Color(0.00, 0.00, 0.00)
const FeatureColorGreen = Color(0.15, 0.50, 0.25)
const FeatureColorGray =  Color(0.60, 0.60, 0.60)
const FeatureColorWhite = Color(1.00, 1.00, 1.00)
const WallColor =         Color(0.65, 0.625, 0.60)
const FenceColor =        Color(0.8,  0.4, 0.2)
const DoorColor =         Color(1.00, 1.00, 1.00)
const StairColor =        Color(1.00, 1.00, 1.00)
const GridColor =         Color(0, 0, 0, 0.1)

var tileSize
var wallWidth
var label
var tiles
var biomeAreas

# TODO: Eventually the MapSection will have to take tile visibility into consideration. Normally we
#       only want to show tiles that the player has seen. They don't nessessarily need to have
#       visited the tile, but have had the tile in their view (which is more difficult to figure out
#       of course) That's the only way that solid tiles would become visible of course. We'd also
#       need a way to determine if a tile blocks the view of the tile past it, or even how much.
#       You should be able to see around a tree for instance, but not though a solid block, but also
#       maybe not as well as through open air. The amount of light the party is emitting should also
#       effect this. Plus there will be spells to show an area of the map, so need to include those
#       tiles on the map as well. This feature is much further down the road though.

func _init(mapScale):
	setMapScale(mapScale)

func setMapScale(mapScale):
	self.tileSize = mapScale.tileSize
	self.wallWidth = mapScale.wallWidth
	self.size = Vector2(
		tileSize * Constants.ChunkSize,
		tileSize * Constants.ChunkSize)
	queue_redraw()

func _draw():
	draw_rect(Rect2(Vector2(0,0),Vector2(size.x,size.y)),BackgroundColor,true)

	if tiles:
		for y in Constants.ChunkSize:
			for x in Constants.ChunkSize:
				var tile = tiles[x + y*Constants.ChunkSize]
				if tile:
					drawTile(x,y,tile)

	if biomeAreas:
		for area in biomeAreas.keys():
			for index in biomeAreas[area]:
				var x = index % Constants.ChunkSize
				var y = index / Constants.ChunkSize
				drawBiomeTile(x,y,area)

func drawTile(x,y,tile):
	var centerPoint = Vector2(
		(tileSize/2) + (x*tileSize),
		(tileSize/2) + (y*tileSize))
	var points = createPointMap(centerPoint)

	drawFloor(tile,points)
	drawGrid(points)
	drawStairs(tile,points)

	# Drawing walls should include doors and other direction specific things.
	for facing in Constants.NSEW:
		var wall = tile.wallAt(facing)
		if wall:
			drawWall(points, facing, wall)

func drawBiomeTile(x,y,area):
	var centerPoint = Vector2(
		(tileSize/2) + (x*tileSize),
		(tileSize/2) + (y*tileSize))
	var points = createPointMap(centerPoint)

	var color = {
		0: Color(0.10, 0.30, 0.15, 0.20),
		1: Color(0.15, 0.50, 0.25, 0.20),
		2: Color(0.20, 0.70, 0.35, 0.20),
	}[area]

	draw_rect(points.bounds, color, true)
	drawGrid(points)

func drawGrid(points):
	draw_line(points.nw, points.ne, GridColor, wallWidth)
	draw_line(points.nw, points.sw, GridColor, wallWidth)

# Draw the tile floor. If the tile is solid we should either render a solid block the color of the
# wall or a symbol representing whatever is filling the tile.
func drawFloor(tile,points):
	var floorColor = VoidFloorColor
	var symbol
	var symbolColor

	if tile.theFloor:
		if tile.theFloor.type == Floor.Type.Normal:
			floorColor = NormalFloorColor
		if tile.theFloor.type == Floor.Type.Water:
			floorColor = WaterFloorColor

	if tile.type == Tile.Type.Solid:
		if ["stone",null].has(tile.fill):
			floorColor = WallColor
		elif tile.fill.has("tree"):
			symbol = "square"
			symbolColor = FeatureColorGreen
		elif tile.fill.has("statue"):
			symbol = "circle"
			symbolColor = FeatureColorGray

	draw_rect(points.bounds, floorColor, true)

	if symbol:
		if symbol == "square":
			draw_rect(points.bounds.grow(wallWidth * -2),symbolColor,true)
		if symbol == "circle":
			draw_circle(points.bounds.get_center(), points.bounds.size.x/4, symbolColor)

func drawStairs(tile,points):
	if [Tile.Type.StairsUp, Tile.Type.StairsDown].has(tile.type):
		var triangle

		if tile.type == Tile.Type.StairsUp:
			triangle = [points.n, points.sw, points.se]
		if tile.type == Tile.Type.StairsDown:
			triangle = [points.s, points.nw, points.ne]

		draw_colored_polygon(triangle, StairColor)

func drawWall(corners, facing, wall):
	var doorSide = wallWidth*1.5
	var doorOut = wallWidth*0.5
	var doorWidth = wallWidth*2

	var color = WallColor
	var offset = 0

	if wall.type == Wall.Type.Fence:
		offset = tileSize / 8
		color = FenceColor

	if facing == Constants.North:
		var nw = corners.nw + Vector2(0,offset)
		var ne = corners.ne + Vector2(0,offset)
		draw_line(nw, ne, color, wallWidth)
		if wall.type == Wall.Type.Door:
			var d1 = corners.nw + Vector2(doorSide,doorOut)
			var d2 = corners.ne + Vector2(-doorSide,doorOut)
			draw_line(d1, d2, DoorColor, doorWidth)

	if facing == Constants.South:
		var sw = corners.sw + Vector2(0,-offset)
		var se = corners.se + Vector2(0,-offset)
		draw_line(sw, se, color, wallWidth)
		if wall.type == Wall.Type.Door:
			var d1 = corners.sw + Vector2(doorSide,-doorOut)
			var d2 = corners.se + Vector2(-doorSide,-doorOut)
			draw_line(d1, d2, DoorColor, doorWidth)

	if facing == Constants.East:
		var ne = corners.ne + Vector2(-offset,0)
		var se = corners.se + Vector2(-offset,0)
		draw_line(ne, se, color, wallWidth)
		if wall.type == Wall.Type.Door:
			var d1 = corners.ne + Vector2(-doorOut, doorSide)
			var d2 = corners.se + Vector2(-doorOut,-doorSide)
			draw_line(d1, d2, DoorColor, doorWidth)

	if facing == Constants.West:
		var nw = corners.nw + Vector2(offset,0)
		var sw = corners.sw + Vector2(offset,0)
		draw_line(nw, sw, color, wallWidth)
		if wall.type == Wall.Type.Door:
			var d1 = corners.nw + Vector2(doorOut, doorSide)
			var d2 = corners.sw + Vector2(doorOut,-doorSide)
			draw_line(d1, d2, DoorColor, doorWidth)

# All this shit looks like something that would make a handy utility function as well. I'm making a
# map of all the corners in a rectangle. I need both bounds and corners because lines are drawn
# with corners and rectangles are drawn with bounds.
func createPointMap(centerPoint:Vector2):
	var points = { "c": centerPoint }

	points.n = Vector2(
		centerPoint.x,
		centerPoint.y - (tileSize/2))
	points.s = Vector2(
		centerPoint.x,
		centerPoint.y + (tileSize/2))
	points.e = Vector2(
		centerPoint.x + (tileSize/2),
		centerPoint.y)
	points.w = Vector2(
		centerPoint.x - (tileSize/2),
		centerPoint.y)

	points.nw = Vector2(
		centerPoint.x - (tileSize/2),
		centerPoint.y - (tileSize/2))
	points.ne = Vector2(
		points.nw.x + tileSize,
		points.nw.y)
	points.se = Vector2(
		points.ne.x,
		points.ne.y + tileSize)
	points.sw = Vector2(
		points.nw.x,
		points.se.y)

	points.bounds = Rect2(
		points.nw.x,
		points.nw.y,
		points.ne.x-points.nw.x,
		points.sw.y-points.nw.y)

	# Apply margin after defining bounds. This should normally be 0 actually, but I sometimes need
	# check to ensure that if a wall exists between two tiles, both tiles have the opposing walls.
	var margin = 0#4
	points.nw.x += margin
	points.nw.y += margin
	points.ne.x += -margin
	points.ne.y += margin
	points.se.x += -margin
	points.se.y += -margin
	points.sw.x += margin
	points.sw.y += -margin

	return points

# May need to tweek this size
func glyphSize():
	return self.tileSize
