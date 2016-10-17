var tilelive = require('tilelive');
var fs = require('fs');
var path = require('path');
var url = require('url');
var mkdirp = require('mkdirp');
var async = require('async');
require('tilelive-mapnik').registerProtocols(tilelive);

function lat2Tile(y,z){
  var nTiles = Math.pow(2, z);
  var latRad = y * Math.PI / 180;
  return Math.floor((nTiles * (1-(Math.log(Math.tan(latRad) + 1/Math.cos(latRad)) / Math.PI)) / 2));
}

function lon2Tile(x,z){
  var nTiles = Math.pow(2, z);
  return Math.floor((nTiles * (( x + 180 ) / 360)));
}

var z1 = 11;
var x1 = -111.084742;
var y1 = 29.176726;

var z2 = 16;
var x2 = -110.893232;
var y2 = 28.987584;

var styleSheetPath = url.resolve('mapnik://',path.resolve("stylesheet.xml"));

var arrayTask = [];

for(var z = z1; z <= z2 ; z++){

  var xTileMin = lon2Tile(x1, z);
  var yTileMin = lat2Tile(y1, z);

  var xTileMax = lon2Tile(x2, z);
  var yTileMax = lat2Tile(y2, z);

  for(var x = xTileMin; x <= xTileMax; x++){
    for(var y = yTileMin; y <= yTileMax; y++){
      arrayTask.push({
        x: x, y: y, z: z
      });
    }
  }
}

tilelive.load(styleSheetPath, function(err, source) {
  async.parallel(arrayTask.map((tile) => {
    return function(cb) {
      doShit(tile, cb);
    };
  }), (err) => {
    if (err) {
      console.log(err);
    }

    console.log('done');
  });

  function doShit(t, cb) {
    source.getTile(t.z, t.x, t.y, function(err, tile, headers) {
      if (err){
        return cb(err);
      }

      var rutaTile = path.resolve("estructura");
      var nombreImagen = t.z.toString()+'-'+t.x.toString()+'-'+t.y.toString() + '.png';

      console.log(path.join(rutaTile, nombreImagen));

      mkdirp(rutaTile, function(){
        fs.writeFileSync(path.join(rutaTile, nombreImagen), tile);
        cb();
      });
    });
  }
});
