extends Object

class_name WorldMap

const ground = 10

var chunks
var random: RandomNumberGenerator

func _init(random_):
	self.random = random_

# The world map is a map of Vector3i to chunk definations. I really just need to know a chunk's
# type and an ID of some sort to know which builder to use. When building chunks a chunk builder
# will need to know the types of the neighboring chunks to help blend the biomes together smoothly
func build():

	# A few chunks are always located in the same places.
	chunks = {
		Vector3i(115,100,ground): { "prefab":"Origin-W" },
		Vector3i(116,100,ground): { "prefab":"Origin"   },
		Vector3i(117,100,ground): { "prefab":"Origin-E" },
		Vector3i(131,99,ground):  { "prefab":"Docks-NW" },
		Vector3i(131,100,ground): { "prefab":"Docks-SW" },
		Vector3i(132,99,ground):  { "prefab":"Docks-NE" },
		Vector3i(132,100,ground): { "prefab":"Docks-SE" },
	}

	# An shore runs from the town towards the clifs to either side.
	for x in range(101,115):
		chunks[Vector3i(x,100,ground)] = { "type":"Shore" }
	for x in range(118,131):
		chunks[Vector3i(x,100,ground)] = { "type":"Shore" }

	# Ocean chunks are set above the shore.
	for x in range(101,131):
		chunks[Vector3i(x,99,ground)] = { "type":"Ocean" }

	# The boundry cliffs stretch from north to south. We also randomly add cliff chunks that extend
	# into the forest region. This happens more frequently the further south you go. The south
	# border of the map is also cliffs
	chunks[Vector3i(100,99,ground)] =  { "prefab":"WestCliff-Ocean" }
	chunks[Vector3i(100,100,ground)] = { "prefab":"WestCliff-Shore" }

	# Western Cliffs
	for y in range(101,132):
		var extend = 1
		if y <= 110:
			extend = random.randi_range(1,2)
		if y > 110 && y <= 118:
			extend = random.randi_range(1,3)
		if y > 108 && y <= 126:
			extend = random.randi_range(2,4)
		if y > 126:
			extend = random.randi_range(3,5)
		for x in extend:
			chunks[Vector3i(x+100, y, ground)] = { "type":"Cliff" }

	# Eastern Cliffs
	for y in range(101,132):
		var extend = 1
		if y <= 110:
			extend = random.randi_range(2,3)
		if y > 110 && y <= 118:
			extend = random.randi_range(2,4)
		if y > 108 && y <= 126:
			extend = random.randi_range(3,4)
		if y > 126:
			extend = random.randi_range(4,6)
		for x in extend:
			chunks[Vector3i(x+133-extend, y, ground)] = { "type":"Cliff" }

	# Southern Cliffs
	for x in range(100,133):
		var extend = random.randi_range(1,3)
		for y in extend:
			chunks[Vector3i(x, y+133-extend, ground)] = { "type":"Cliff" }

	# Now that the overworld boundries are set we can start randomly placing the important chunks

	# The Graveyard
	# The graveyard is a fairly large area, a 3x3 chunk square placed somewhere in the overworld
	# forest. Numerous entrances to the dungeon can be found in the crypts that lead down into the
	# catacombs below.
	placeArea(
		Vector3i(5,5,1),
		Vector3i(107,114,ground),
		Vector3i(118,124,ground),
		"Graveyard")

	# The Gardens
	# Located somewhere in the northern part of the forest.
	var width = random.randi_range(5,7)
	var height = random.randi_range(5,7)

	placeArea(
		Vector3i(width,height,1),
		Vector3i(100,100,ground),
		Vector3i(127,105,ground),
		"Garden")

	printWorldMap(ground)


func placeArea(size,start,end,type):
	var area = findFreeArea(size, start, end)
	for z in range(area.z, area.z+size.z):
		for y in range(area.y+1, area.y+size.y-1):
			for x in range(area.x+1, area.x+size.x-1):
				print("Placing {0} chunk at ({1},{2},{3})".format([type,x,y,z]))
				chunks[Vector3i(x, y, ground)] = { "type":type }

# Look at the chunks at the specified level and find a free are
func findFreeArea(size,start,end):
	var xRange = end.x - start.x
	var yRange = end.y - start.y
	var zRange = end.z - start.z
	var x = 0
	var y = 0
	var z = 0
	var attempts = 0

	print("Looking for a free space")
	print("  size:",size)
	print("  start:",start)
	print("  end:",end)

	while true:
		attempts += 1

		if xRange > 0:
			x = random.randi() % xRange
		if yRange > 0:
			y = random.randi() % yRange
		if zRange > 0:
			z = random.randi() % zRange

		x += start.x
		y += start.y
		z += start.z

		for cz in range(z,z+size.z):
			for cy in range(y,y+size.y):
				for cx in range(x,x+size.x):
					if chunks.has(Vector3i(cx,cy,cz)):
						continue

		print("Found:({0},{1},{2}) in {3} attempts".format([x,y,z,attempts]))
		return Vector3i(x,y,z)




# ==== Printing ====================================================================================

const prefabIcons = {
	"Origin": "0",
	"Docks": "♆",
	"WestCliff": "◮",
	"EastCliff": "◭",
}

const chunkIcons = {
	"Cliff":"▲",
	"Shore":"_",
	"Ocean":"≈",
	"Graveyard": "♅",
	"Garden": "♣",
}

func printWorldMap(z):
	print("\n===== Level:{0} =====".format([z]))
	for y in range(99,133):
		var row = ""
		for x in range(100,133):
			row = "{0}{1}".format([row,getIcon(Vector3i(x,y,z))])
		print(row)
	print("")

func getIcon(index):
	if chunks.has(index):
		if chunks[index].has("prefab"):
			return getPrefabIcon(index)
		if chunks[index].has("type"):
			return getChunkIcon(index)
	return "[ ]"

func getPrefabIcon(index):
	for start in prefabIcons.keys():
		if chunks[index].prefab.find(start) == 0:
			return "[{0}]".format([prefabIcons[start]])

func getChunkIcon(index):
	return "[{0}]".format([chunkIcons[chunks[index].type]])
