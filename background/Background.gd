extends Control

enum Anchor { Bottom, Center }

var anchor = Anchor.Bottom

func _ready():
	visible = true
	resize()

func _process(delta):
	pass

func _on_resized():
	resize()
	
func resize():
	var backSize = $BackgroundTexture.texture.get_size()
	var viewSize = get_viewport_rect().size

	var scale = 0.5
	var scaleX = viewSize.x / backSize.x
	var scaleY = viewSize.y / backSize.y

	if (scaleX > scaleY):
		scale = scaleX
	if (scaleY > scaleX):
		scale = scaleY

	var x = 0
	var y = 0

	y = (viewSize.y - backSize.y * scale)
	x = (viewSize.x - backSize.x * scale) / 2
	
	$BackgroundTexture.set_position(Vector2(x,y))
	$BackgroundTexture.set_scale(Vector2(scale, scale))
