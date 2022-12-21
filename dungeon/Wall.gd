extends Node
class_name Wall

enum Type { Normal, Door }
enum Certainty {
  None,         # Absolutely flexible, nothing has touched this.
  Tentative,    # This was placed by a generator and subject to change.
  Provisional,  # Assume that this will remain in this state.
  High,         # Changing this will force other things to be rebuilt.
  Absolute,     # Changing this will break something.
}

var type
var certainty

func _init(type, certainty):
	self.type = type
	self.certainty = certainty

func typeString(): 
	return {
		Type.Normal: "Nrml",
		Type.Door: "Door",
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
