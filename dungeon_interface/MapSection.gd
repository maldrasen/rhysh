extends TextureRect

class_name MapSection

var mapScale
var label
var tiles
var biomeAreas

var font = load("res://assets/fonts/LibreBaskerville-Regular.ttf")


func _init(p_mapScale):
	setMapScale(p_mapScale)

func setMapScale(p_mapScale):
	self.mapScale = p_mapScale
	self.size = Vector2(
		mapScale.tileSize * Constants.ChunkSize,
		mapScale.tileSize * Constants.ChunkSize)
	queue_redraw()

var testColor1 = Color(1,0,0,0.2)
var testColor2 = Color(1,0,0)

func _draw():
	draw_line(Vector2(0,0),Vector2(size.x,size.y),testColor1,3)
	draw_line(Vector2(size.x,0),Vector2(0,size.y),testColor1,3)
	draw_rect(Rect2(Vector2(0,0),Vector2(size.x,size.y)),testColor1,false,3)
	draw_string(font, Vector2(10,40), label, HORIZONTAL_ALIGNMENT_LEFT, -1, 30, testColor2)


