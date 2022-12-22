extends Node2D


# Called when the node enters the scene tree for the first time.
func _ready():
	pass # Replace with function body.


# Called every frame. 'delta' is the elapsed time since the previous frame.
func _process(delta):
	pass

func _draw():
	drawFrame()

func drawFrame():
	var viewSize = get_viewport_rect().size
	var topMargin = 20
	var bottomMargin = 120
	var rectum = Rect2(topMargin,topMargin,viewSize.x-(topMargin*2),viewSize.y-topMargin-bottomMargin)

	var backgroundColor = Color(0.21, 0.2, 0.2)
	var edgeColor = Color(0.75, 0.7, 0.7)

	drawShadow(rectum)
	draw_rect(rectum, backgroundColor, true, 0.5)
	draw_rect(rectum, edgeColor, false, 1)

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

#	var center = Vector2(200, 200)
#	var radius = 80
#	var angle_from = 75
#	var angle_to = 195
#	var color = Color(1.0, 0.0, 0.0)
#	draw_circle_arc(center, radius, angle_from, angle_to, color)

func draw_circle_arc(center, radius, angle_from, angle_to, color):
	var nb_points = 32
	var points_arc = PackedVector2Array()

	for i in range(nb_points + 1):
		var angle_point = deg_to_rad(angle_from + i * (angle_to-angle_from) / nb_points - 90)
		points_arc.push_back(center + Vector2(cos(angle_point), sin(angle_point)) * radius)

	for index_point in range(nb_points):
		draw_line(points_arc[index_point], points_arc[index_point + 1], color)
