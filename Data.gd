extends Node

func packVector3i(vector:Vector3i):
	return [vector.x, vector.y, vector.z]

func unpackVector3i(array):
	return Vector3i(array[0],array[1],array[2])
