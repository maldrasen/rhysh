extends Object

class_name ExtensionLoader

var dataSource

func _init(source):
	self.dataSource = source

# This function builds the tile data for this layer given a tile ID and a layer type. If we're
# building the extended layer we need to also lookup what the actual extension value should be in
# the zoneData file. All extensions will either have a value (which is a simple lookup by key on
# the dataSource) or a method to get that value.
#
# TODO: There are a few method types that I think we'll need that aren't implemented yet. I'm
#       thinking something like LootTable and TrapTable? May need a ResourceTable too for random
#       resources found in the dungeon. The problem is, when I'm building this, I don't know what
#       kind of zone we're in. Might just ignore most methods here and handle them when we're at a
#       place where we know what to do with them.
#
func adjustedLayerData(layerType, tileId, point:Vector3i):
	var layerData = MapData.lookup(layerType, tileId).duplicate()
	if layerType != "extended":
		return layerData

	if layerData.has("value"):
		layerData.value = lookupExtensionValue(dataSource, layerData)

	if layerData.has("method") && layerData.method == "Point":
		layerData.value = lookupExtensionValueAt(dataSource, layerData, point)
		print("Lookup At:",point," -> ",layerData)

	return layerData

func lookupExtensionValue(dataSource, layerData):
	if dataSource.extensions.has(layerData.value):
		return dataSource.extensions[layerData.value]
	printerr("Error: Extension should have a lookup value in the data file but does not. ",layerData)

func lookupExtensionValueAt(dataSource, layerData, point:Vector3i):
	var key = "Point({0},{1},{2})".format([point.x, point.y, point.z])
	if dataSource.extensions.has(key):
		return dataSource.extensions[key]
	printerr("Error: Extension should have ",key," in the data file but does not. ",layerData)
