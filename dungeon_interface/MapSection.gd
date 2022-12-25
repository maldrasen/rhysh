extends TextureRect

class_name MapSection

const backgroundColor =  Color(0.10, 0.10, 0.10)
const normalFloorColor = Color(0.20, 0.20, 0.20)
const waterFloorColor =  Color(0.20, 0.30, 0.40)
const wallColorA =       Color(0.90, 0.90, 0.90)
const wallColorB =       Color(0.50, 0.50, 0.50)

var tileSize
var wallWidth
var label
var tiles
var biomeAreas



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
	draw_rect(Rect2(Vector2(0,0),Vector2(size.x,size.y)),backgroundColor,true)

	if tiles:
		for y in Constants.ChunkSize:
			for x in Constants.ChunkSize:
				var tile = tiles[x + y*Constants.ChunkSize]
				if tile:
					drawTile(x,y,tile)

func drawTile(x,y,tile):

	var centerPoint = Vector2(
		(tileSize/2) + (x*tileSize),
		(tileSize/2) + (y*tileSize))
	var corners = createCornerMap(centerPoint)

	# Draw floor. Needs to include solid tiles as well.
	draw_rect(corners.bounds, tileFloorColor(tile), true)

	# Drawing walls should include doors and other direction specific things.
	for facing in Constants.NSEW:
		var wall = tile.wallAt(facing)
		if wall:
			drawWall(corners, facing, wall)

func tileFloorColor(tile):
	if tile.theFloor.type == Floor.Type.Water:
		return waterFloorColor
	return normalFloorColor

func drawWall(corners, facing, wall):
	if facing == Constants.North:
		draw_line(corners.nw, corners.ne, wallColorA, wallWidth)
	if facing == Constants.South:
		draw_line(corners.sw, corners.se, wallColorB, wallWidth)
	if facing == Constants.East:
		draw_line(corners.ne, corners.se, wallColorB, wallWidth)
	if facing == Constants.West:
		draw_line(corners.nw, corners.sw, wallColorA, wallWidth)


# All this shit looks like something that would make a handy utility function as well. I'm making a
# map of all the corners in a rectangle. I need both bounds and corners because lines are drawn
# with corners and rectangles are drawn with bounds.
func createCornerMap(centerPoint:Vector2):
	var corners = {}

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
