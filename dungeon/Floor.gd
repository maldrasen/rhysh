extends Node
class_name Floor

enum Type { Normal, Water }

var type:Type

func _init(t):
	self.type = t


# ==== Persistance =================================================================================

func pack():
	return { "type":self.type }

static func unpack(data):
	return Floor.new(data.type)

# ==== To String ===================================================================================

static func fromString(floorType):
	if floorType == "Void":
		return null

	return Floor.new({
		"Normal": Type.Normal,
		"Water": Type.Water
	}[floorType])

func typeString():
	return {
		Type.Normal: "Nrml",
		Type.Water: "Watr",
	}[self.type]

func _to_string():
	return self.typeString()
