extends Object

class_name WorldMap

const ground = 10

var chunks
var chunkLocations
var random: RandomNumberGenerator

func _init(random_):
	self.random = random_
	self.chunkLocations = {}
	self.chunks = {
		Vector3i(115,100,ground): { "prefab":"Origin-W" },
		Vector3i(116,100,ground): { "prefab":"Origin"   },
		Vector3i(117,100,ground): { "prefab":"Origin-E" },
		Vector3i(131,99,ground):  { "prefab":"Docks-NW" },
		Vector3i(131,100,ground): { "prefab":"Docks-SW" },
		Vector3i(132,99,ground):  { "prefab":"Docks-NE" },
		Vector3i(132,100,ground): { "prefab":"Docks-SE" },
	}

# The world map is a map of Vector3i to chunk definations. I really just need to know a chunk's
# type and an ID of some sort to know which builder to use. When building chunks a chunk builder
# will need to know the types of the neighboring chunks to help blend the biomes together smoothly
func build():

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

	# Ruins
	# The ruins should be the largest area in the forest, so they need to be placed first. They
	# shouldn't be exactly square either so after placing the ruins we adject the chunks removing
	# corners and making the middle thicker.

	var width = random.randi_range(10,12)
	var height = random.randi_range(14,16)
	var corner = placeArea(
		Vector3i(width,height,1),
		Vector3i(100,110,ground),
		Vector3i(120,120,ground),
		"Ruins")

	decayArea(corner,width,height)
	chunkLocations["Ruins"] = findCenter(corner,width,height)

	# The Graveyard
	# The graveyard is a fairly large area, a 3x3 chunk square placed somewhere in the overworld
	# forest. Numerous entrances to the dungeon can be found in the crypts that lead down into the
	# catacombs below.
	#
	# TODO: Build catacomb chunks below the graveyard.
	corner = placeArea(
		Vector3i(5,5,1),
		Vector3i(100,110,ground),
		Vector3i(127,127,ground),
		"Graveyard")
	chunkLocations["Graveyard"] = findCenter(corner,5,5)


	# The Gardens
	# The gardens are another large area in the overworld. It should be located somewhere in the
	# northern part of the forest.
	width = random.randi_range(7,9)
	height = random.randi_range(7,9)
	corner = placeArea(
		Vector3i(width,height,1),
		Vector3i(100,100,ground),
		Vector3i(127,105,ground),
		"Garden")

	decayArea(corner,width,height)
	chunkLocations["Garden"] = findCenter(corner,width,height)

	# Place single tile chunks.
	chunkLocations["RuinedCathedral"] = placeChunk(
		Vector3i(100,120,10),
		Vector3i(132,132,10),
		{ "prefab":"RuinedCathedral"})

	# TODO: Connect areas with roads. Should make some areas easier to find.

	# Finally display the generated map.
	if Constants.DebugMode:
		print("=== Built World Map ===")
		for key in chunkLocations.keys():
			var i = chunkLocations[key]
			print("  ({0},{1},{2}) : {3}".format([i.x,i.y,i.z,key]))
		printWorldMap(ground)


# Get the chunk type at the index. It's likely that there isn't a predefined chunk at that index.
# When this happens we determine the type of chunk that should be there.
func chunkTypeAt(index:Vector3i):
	if chunks.has(index):
		return chunks[index]

	# The ground level has its own set of chunks.
	if index.z == ground:
		if index.y < 100:
			return { "type":"Ocean" }
		if index.y > 132:
			return { "type":"Cliff" }
		if index.x < 100:
			return { "type":"Cliff" }
		if index.x > 132:
			return { "type":"Cliff" }
		return { "type":"DarkWood" }

# Find the center chunk of an area, useful for giving directions.
func findCenter(corner,width,height):
	return Vector3i(
		corner.x + floor(width/2),
		corner.y + floor(height/2),
		corner.z)

# ==== Modify Placed Areas =========================================================================
# After a rectangular area of tiles has been placed we can shave the corners and side a bit to give
# it a more organic looking shape. Lots of lines of code to do something relatively simple.

func decayArea(corner,width,height):
	var nw = corner + Vector3i(1,1,0)
	var ne = corner + Vector3i(width-2,1,0)
	var sw = corner + Vector3i(1,height-2,0)
	var se = corner + Vector3i(width-2,height-2,0)

	chunks.erase(nw)
	chunks.erase(ne)
	chunks.erase(sw)
	chunks.erase(se)

	var sideChance = 20
	var cornerChance = 60
	var deepCornerChance = 20

	for x in range(nw.x, ne.x):
		if random.randi() % 100 < sideChance:
			chunks.erase(Vector3i(x,nw.y,nw.z))
	for x in range(sw.x, se.x):
		if random.randi() % 100 < sideChance:
			chunks.erase(Vector3i(x,sw.y,sw.z))
	for y in range(nw.y, sw.y):
		if random.randi() % 100 < sideChance:
			chunks.erase(Vector3i(nw.x,y,nw.z))
	for y in range(ne.x, se.x):
		if random.randi() % 100 < sideChance:
			chunks.erase(Vector3i(ne.x,y,ne.z))

	if width > 5:
		if random.randi() % 100 < cornerChance:
			chunks.erase(nw + Vector3i(1,0,0))
		if random.randi() % 100 < cornerChance:
			chunks.erase(ne + Vector3i(-1,0,0))
		if random.randi() % 100 < cornerChance:
			chunks.erase(sw + Vector3i(1,0,0))
		if random.randi() % 100 < cornerChance:
			chunks.erase(se + Vector3i(-1,0,0))

	if width > 7:
		if random.randi() % 100 < deepCornerChance:
			chunks.erase(nw + Vector3i(2,0,0))
		if random.randi() % 100 < deepCornerChance:
			chunks.erase(ne + Vector3i(-2,0,0))
		if random.randi() % 100 < deepCornerChance:
			chunks.erase(sw + Vector3i(2,0,0))
		if random.randi() % 100 < deepCornerChance:
			chunks.erase(se + Vector3i(-2,0,0))

	if height > 5:
		if random.randi() % 100 < cornerChance:
			chunks.erase(nw + Vector3i(0,1,0))
		if random.randi() % 100 < cornerChance:
			chunks.erase(ne + Vector3i(0,1,0))
		if random.randi() % 100 < cornerChance:
			chunks.erase(sw + Vector3i(0,-1,0))
		if random.randi() % 100 < cornerChance:
			chunks.erase(se + Vector3i(0,-1,0))

	if height > 7:
		if random.randi() % 100 < deepCornerChance:
			chunks.erase(nw + Vector3i(0,2,0))
		if random.randi() % 100 < deepCornerChance:
			chunks.erase(ne + Vector3i(0,2,0))
		if random.randi() % 100 < deepCornerChance:
			chunks.erase(sw + Vector3i(0,-2,0))
		if random.randi() % 100 < deepCornerChance:
			chunks.erase(se + Vector3i(0,-2,0))

	if width > 7 && height > 7:
		if random.randi() % 100 < deepCornerChance:
			chunks.erase(nw + Vector3i(2,2,0))
		if random.randi() % 100 < deepCornerChance:
			chunks.erase(ne + Vector3i(-2,2,0))
		if random.randi() % 100 < deepCornerChance:
			chunks.erase(sw + Vector3i(2,-2,0))
		if random.randi() % 100 < deepCornerChance:
			chunks.erase(se + Vector3i(-2,-2,0))

# ==== Place Chunks and Areas ======================================================================

func placeChunk(start,end,type):
	var index = findFreeChunk(start,end)
	chunks[index] = type
	return index

func placeArea(size,start,end,type):
	var corner = findFreeArea(size, start, end, type)
	for z in range(corner.z, corner.z+size.z):
		for y in range(corner.y+1, corner.y+size.y-1):
			for x in range(corner.x+1, corner.x+size.x-1):
				chunks[Vector3i(x, y, ground)] = { "type":type }
	return corner

func findFreeChunk(start, end):
	var xRange = end.x - start.x
	var yRange = end.y - start.y
	var zRange = end.z - start.z
	var x = 0
	var y = 0
	var z = 0

	while true:
		if xRange > 0:
			x = random.randi() % xRange
		if yRange > 0:
			y = random.randi() % yRange
		if zRange > 0:
			z = random.randi() % zRange

		var index = Vector3i(x+start.x, y+start.y ,z+start.z)
		if false == chunks.has(index):
			return index

# Look at the chunks at the specified level and find a free are
func findFreeArea(size, start, end, type):
	var xRange = end.x - start.x
	var yRange = end.y - start.y
	var zRange = end.z - start.z

	while true:
		var valid = true
		var x = 0
		var y = 0
		var z = 0

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
			for cy in range(y,y+size.y+1):
				for cx in range(x,x+size.x+1):
					var index = Vector3i(cx,cy,cz)
					if chunks.has(index):
						valid = false

		if valid:
			return Vector3i(x,y,z)

# ==== Printing ====================================================================================

const prefabIcons = {
	"Origin": "0",
	"Docks": "♆",
	"WestCliff": "◮",
	"EastCliff": "◭",
	"RuinedCathedral": "♅",
}

const chunkIcons = {
	"Cliff":"▲",
	"Shore":"_",
	"Ocean":"≈",
	"Graveyard": "∩",
	"Garden": "♣",
	"DarkWood": " ",
	"Ruins": "□"
}

func printWorldMap(z):
	print("\n [ Z Level:{0} ]".format([z]))
	for y in range(99,133):
		var row = ""
		for x in range(100,133):
			row = "{0}{1}".format([row,getIcon(Vector3i(x,y,z))])
		print(row)
	print("")

func getIcon(index):
	var chunk = chunkTypeAt(index)
	if chunk.has("prefab"):
		return getPrefabIcon(chunk)
	if chunk.has("type"):
		return getChunkIcon(chunk)

	printerr("Warning: No icon for this chunk type. ",chunk)
	return " ?"

func getPrefabIcon(chunk):
	for start in prefabIcons.keys():
		if chunk.prefab.find(start) == 0:
			return " {0}".format([prefabIcons[start]])

func getChunkIcon(chunk):
	return " {0}".format([chunkIcons[chunk.type]])
