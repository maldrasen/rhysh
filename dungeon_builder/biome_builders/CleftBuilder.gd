extends BiomeBuilder

class_name CleftBuilder

var cleftSector
var cleftTile

# TODO: Also maybe add some cleft specific features before we carve all these paths.

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
