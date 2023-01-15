extends BiomeBuilder

class_name CleftBuilder

var cleftSector
var cleftTile

# TODO: I tried adding some random cave features to the clefts, but I didn't think that they
#		worked very well. The didn't really fit into the rocky, narrow passage look that I'm going
#		for. Just plopping in features does't play well with the diggers either and they end up
#		disconnected from everything else. Instead, I think I should loop through the cleft tiles
#		for dead ends and randomly place interesting things there, especially for those dead ends
#		that are looking off the side of the cliff.

# [BiomeBuilder Implementation]
func placeFeatures():
	cleftSector = Dungeon.defineNextSector("outside")

	cleftTile = Tile.normal()
	cleftTile.biome = "Cleft"
	cleftTile.sector = cleftSector

	CrackDigger.new({
		"biomeBuilder": self,
		"tileSource": self.tileSource,
		"carvePoints": self.supplementaryData.CarvePoints,
		"defaultTile": defaultTile(),
	}).start(0.33)

	TunnelDigger.new({
		"biomeBuilder": self,
		"tileSource": self.tileSource,
		"defaultTile": defaultTile(),
	}).start()

	fillSpace()

# [BiomeBuilder Implementation]
func defaultTile():
	return cleftTile

# Unused cleft tiles are filled with solid stone.
func fillSpace():
	for index in freeTiles:
		tileSource.setTile(index, Tile.solidStone())
