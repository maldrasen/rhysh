extends Object
class_name Wall

enum Type { Normal, Door, Fence }
enum Certainty {
  None,         # Absolutely flexible, nothing has touched this.
  Tentative,    # This was placed by a generator and subject to change.
  Provisional,  # Assume that this will remain in this state.
  High,         # Changing this will force other things to be rebuilt.
  Absolute,     # Changing this will break something.
}

var type:Type
var certainty:Certainty

func _init(t, c):
	self.type = t
	self.certainty = c

static func normal(certainty):
	return Wall.new(Type.Normal, certainty)

# ==== Persistance =================================================================================

func pack():
	return { "type":self.type, "certainty":self.certainty }

static func unpack(data):
	return Wall.new(data.type, data.certainty)

# ==== To String ===================================================================================

func typeString():
	return {
		Type.Normal: "Nrml",
		Type.Door: "Door",
		Type.Fence: "Fnce",
	}[self.type]

func certaintyString():
	return {
		Certainty.None: "0",
		Certainty.Tentative: "1",
		Certainty.Provisional: "2",
		Certainty.High: "3",
		Certainty.Absolute: "4",
	}[self.certainty]

func _to_string():
	var t = self.typeString()
	var c = self.certaintyString()
	return "{0}({1})".format([t,c])
