
I really don't like Godot's tile editor so I'm creating the maps in an external editor called Ogmo. Ogmo sets the format for all of its maps in its .ogmo project file, so once the format is stable the parser shouldn't have to change that often. 

## Layers
- Root X        (Uses tilemap Root Tilemap)
- Extra X       (Uses tilemap Extra Tilemap)
- Extended X    (Uses tilemap Extended Tilemap)

Every zone map needs an associated (Zone)Data.json file. It's not easy to give something arbritrary data in Osmo, so I need to include everything else I need to build a map in a separate file. 

```
{
	"layers":[
		{ "level":100 },    The Osmo maps have multiple layers that each represent a different z level.
		{ "level":101 },    Layers themselves are composed of Root, Extra, and Extended layers
		{ "level":102 },
		{ "level":103 },
	]
}
```

