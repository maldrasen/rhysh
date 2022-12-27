extends BiomeBuilder

class_name GardenBuilder

# [BiomeBuilder Implementation]
func placeFeatures():
	pass

# [BiomeBuilder Implementation]
func connectRegions():
	pass

# [BiomeBuilder Implementation]
func trimDeadEnds():
	pass

# [BiomeBuilder Implementation]
func decorate():
	self.status = Constants.Status.Success
