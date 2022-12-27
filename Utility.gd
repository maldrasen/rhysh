extends Node

func packVector3i(vector:Vector3i):
	return [vector.x, vector.y, vector.z]

func unpackVector3i(array) -> Vector3i:
	return Vector3i(array[0],array[1],array[2])

func oppositeDirection(direction:String) -> String:
	return {
		Constants.North: Constants.South,
		Constants.South: Constants.North,
		Constants.East:  Constants.West,
		Constants.West:  Constants.East
	}[direction]
