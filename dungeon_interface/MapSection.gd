extends TextureRect

class_name MapSection

var mapScale
var tiles
var biomeAreas

func _init(p_mapScale):
	setMapScale(p_mapScale)

func setMapScale(p_mapScale):
	self.mapScale = p_mapScale
	self.size = Vector2(
		mapScale.tileSize * Constants.ChunkSize,
		mapScale.tileSize * Constants.ChunkSize)
	queue_redraw()

func _draw():
	print("===Draw tile===")
	draw_line(Vector2(0,0),Vector2(size.x,size.y),Color.RED,3)
	draw_line(Vector2(size.x,0),Vector2(0,size.y),Color.RED,3)
	draw_rect(Rect2(Vector2(0,0),Vector2(size.x,size.y)),Color.RED,false,3)
