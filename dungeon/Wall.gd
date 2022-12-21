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
