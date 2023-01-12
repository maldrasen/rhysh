extends BiomeBuilder

class_name CleftBuilder

var cleftSector
var cleftTile


# TODO: Also maybe add some cleft specific features before we carve all these paths.

# [BiomeBuilder Implementation]
func placeFeatures():
	self.cleftTile = Tile.normal()
	self.cleftTile.biome = "Cleft"
	self.cleftTile.sector = Dungeon.defineNextSector("outside")

	CrackDigger.new({
		"tileSource": self,
		"carvePoints": self.supplementaryData.CarvePoints,
		"defaultTile": cleftTile,
	}).start(0.33)

	TunnelDigger.new({
		"tileSource": self,
		"defaultTile": cleftTile,
	}).start()

# [BiomeBuilder Implementation]
func defaultTile():
	return cleftTile
