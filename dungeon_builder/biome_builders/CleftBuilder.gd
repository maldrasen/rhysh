extends BiomeBuilder

class_name CleftBuilder

# [BiomeBuilder Implementation]
func placeFeatures():
	pass

# [BiomeBuilder Implementation]
func connectSectors():
	pass

# [BiomeBuilder Implementation]
func trimDeadEnds():
	pass

# [BiomeBuilder Implementation]
func decorate():
	self.status = Constants.Status.Success
