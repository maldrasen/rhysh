global.FeatureFlipper = (function() {

  // ==== Flipping =============================================================
  // As a way to get more variety out of the feature templates we allow most
  // features to be freely flipped, turning each feature into eight.

  function flipH(tileSource) {
    let size = tileSource.size;
    let oldTiles = tileSource.copy();

    forUpTo(size.z, z => {
      forUpTo(size.y, y => {
        let newX = size.x - 1;

        forUpTo(size.x, x => {
          let tile = oldTiles.getTile(new Vector(x,y,z));
          if (tile) { tile.flipH(); }

          tileSource.setTile(new Vector(newX,y,z), tile);
          newX -= 1;
        });
      });
    });
  }

  function flipV(tileSource) {
    let size = tileSource.size;
    let oldTiles = tileSource.copy();

    forUpTo(size.z, z => {
      forUpTo(size.x, x => {
        let newY = size.y - 1;

        forUpTo(size.y, y => {
          let tile = oldTiles.getTile(new Vector(x,y,z));
          if (tile) { tile.flipV(); }

          tileSource.setTile(new Vector(x,newY,z), tile);
          newY -= 1;
        });
      });
    });
  }

  function flipD(tileSource) {
    let oldSize = tileSource.size;
    let oldTiles = tileSource.copy();

    let newSize = new Vector(oldSize.y, oldSize.x, oldSize.z)
    tileSource.setSize(newSize);

    forUpTo(oldSize.z, z => {
      let newX = newSize.x;
      let newY = 0;

      forUpTo(oldSize.y, y => {
        newY = newSize.y;
        newX -= 1;

        forUpTo(oldSize.x, x => {
          newY -= 1

          let tile = oldTiles.getTile(new Vector(x,y,z));
          if (tile) { tile.flipD(); }

          tileSource.setTile(new Vector(newX,newY,z), tile);
        });
      });
    });
  }

  return {
    flipH,
    flipV,
    flipD,
  };

})();

