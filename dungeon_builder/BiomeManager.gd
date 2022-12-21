extends Node

func biomeFromString(string):
	return {
		"DarkWood":    Constants.Biome.DarkWood,
		"Garden":      Constants.Biome.Garden,
		"LightForest": Constants.Biome.LightForest,
		"Ruins":       Constants.Biome.Ruins,
	}[string]

func biomeToString(biome):
	return {
		Constants.Biome.DarkWood:    "DarkWood",
		Constants.Biome.Garden:      "Garden",
		Constants.Biome.LightForest: "LightForest",
		Constants.Biome.Ruins:       "Ruins",
	}[biome]
