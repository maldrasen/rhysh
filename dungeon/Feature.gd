extends Node
class_name Feature

var featureName
var featureType
var region
var size:Vector3
var tiles = []

func _init():
	size = Vector3.ZERO 

func buildRegionTile(x,y,r):
	print("Add ({0},{1}) to region {2}".format([x,y,r]))
	
func buildTile(tileData):
	print("Build Tile:",tileData)
		
