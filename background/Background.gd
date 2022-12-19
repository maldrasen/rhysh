extends Control

@export var anchor:Constants.Anchor = Constants.Anchor.Bottom
@export var texture:Texture2D

func _ready():
	$BackgroundTexture.texture = texture
	visible = true
	resize()

func _on_resized():
	resize()

func resize():
	var backSize = $BackgroundTexture.texture.get_size()
	var viewSize = get_viewport_rect().size

	var newScale = 0.5
	var scaleX = viewSize.x / backSize.x
	var scaleY = viewSize.y / backSize.y

	if (scaleX > scaleY):
		newScale = scaleX
	if (scaleY > scaleX):
		newScale = scaleY

	var x = 0
	var y = 0

	y = (viewSize.y - backSize.y * newScale)
	x = (viewSize.x - backSize.x * newScale) / 2
	
	if (anchor == Constants.Anchor.Center):
		y /= 2
	
	$BackgroundTexture.set_position(Vector2(x,y))
	$BackgroundTexture.set_scale(Vector2(newScale, newScale))
