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
const DoorColor =         Color(1.00, 1.00, 1.00)
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
	var corners = createCornerMap(centerPoint)

	drawFloor(tile,corners)
	drawGrid(corners)

	# Drawing walls should include doors and other direction specific things.
	for facing in Constants.NSEW:
		var wall = tile.wallAt(facing)
		if wall:
			drawWall(corners, facing, wall)

func drawBiomeTile(x,y,area):
	var centerPoint = Vector2(
		(tileSize/2) + (x*tileSize),
		(tileSize/2) + (y*tileSize))
	var corners = createCornerMap(centerPoint)

	var color = {
		0: Color(0.10, 0.30, 0.15, 0.20),
		1: Color(0.15, 0.50, 0.25, 0.20),
		2: Color(0.20, 0.70, 0.35, 0.20),
	}[area]

	draw_rect(corners.bounds, color, true)
	drawGrid(corners)

func drawGrid(corners):
	draw_line(corners.nw, corners.ne, GridColor, wallWidth)
	draw_line(corners.nw, corners.sw, GridColor, wallWidth)



# Draw the tile floor. If the tile is solid we should either render a solid block the color of the
# wall or a symbol representing whatever is filling the tile.
func drawFloor(tile,corners):
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

	draw_rect(corners.bounds, floorColor, true)

	if symbol:
		if symbol == "square":
			draw_rect(corners.bounds.grow(wallWidth * -2),symbolColor,true)
		if symbol == "circle":
			draw_circle(corners.bounds.get_center(), corners.bounds.size.x/4, symbolColor)



func drawWall(corners, facing, wall):
	var doorSide = wallWidth*1.5
	var doorOut = wallWidth*0.5
	var doorWidth = wallWidth*2

	if facing == Constants.North:
		draw_line(corners.nw, corners.ne, WallColor, wallWidth)
		if wall.type == Wall.Type.Door:
			var d1 = corners.nw + Vector2(doorSide,doorOut)
			var d2 = corners.ne + Vector2(-doorSide,doorOut)
			draw_line(d1, d2, DoorColor, doorWidth)

	if facing == Constants.South:
		draw_line(corners.sw, corners.se, WallColor, wallWidth)
		if wall.type == Wall.Type.Door:
			var d1 = corners.sw + Vector2(doorSide,-doorOut)
			var d2 = corners.se + Vector2(-doorSide,-doorOut)
			draw_line(d1, d2, DoorColor, doorWidth)

	if facing == Constants.East:
		draw_line(corners.ne, corners.se, WallColor, wallWidth)
		if wall.type == Wall.Type.Door:
			var d1 = corners.ne + Vector2(-doorOut, doorSide)
			var d2 = corners.se + Vector2(-doorOut,-doorSide)
			draw_line(d1, d2, DoorColor, doorWidth)

	if facing == Constants.West:
		draw_line(corners.nw, corners.sw, WallColor, wallWidth)
		if wall.type == Wall.Type.Door:
			var d1 = corners.nw + Vector2(doorOut, doorSide)
			var d2 = corners.sw + Vector2(doorOut,-doorSide)
			draw_line(d1, d2, DoorColor, doorWidth)

# All this shit looks like something that would make a handy utility function as well. I'm making a
# map of all the corners in a rectangle. I need both bounds and corners because lines are drawn
# with corners and rectangles are drawn with bounds.
func createCornerMap(centerPoint:Vector2):
	var corners = {}

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

	# Apply margin after defining bounds. This should normally be 0 actually, but I sometimes need
	# check to ensure that if a wall exists between two tiles, both tiles have the opposing walls.
	var margin = 0#4
	corners.nw.x += margin
	corners.nw.y += margin
	corners.ne.x += -margin
	corners.ne.y += margin
	corners.se.x += -margin
	corners.se.y += -margin
	corners.sw.x += margin
	corners.sw.y += -margin

	return corners
