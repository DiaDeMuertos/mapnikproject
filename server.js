var tilelive = require('tilelive');
var fs = require('fs');
var path = require('path');
var url = require('url');
var mkdirp = require('mkdirp');
require('tilelive-mapnik').registerProtocols(tilelive);

var express = require('express');
var app = express();

app.get('/:z/:x/:y', function(req, res) {
  res.setHeader("Cache-Control", "max-age=31556926");

  var z = req.params.z;
  var x = req.params.x;
  var y = req.params.y;

  var styleSheetPath = url.resolve('mapnik://',path.resolve("stylesheet.xml"));

  tilelive.load(styleSheetPath, function(err, source) {
      if (err){
        res.end(err.message);
      }
      else{
        source.getTile(z, x, y, function(err, tile, headers) {
          if (err){
            res.end(err.message);
          }
          else{
            // var rutaTile = path.resolve("estructura",z,x);
            // var nombreImagen = y + ".png";
            // mkdirp(rutaTile,function(){
            //   fs.writeFile(path.join(rutaTile, nombreImagen), tile, function(err) {
            //     if (err) throw err;
            //   });
            // });
            res.writeHead(200, {'Content-Type': 'image/png'});
            res.end(tile);
          }
        });
      }
  });

  console.log(z+","+x+","+y);
  res.type("png");
});

app.listen(process.env.PORT || 8001);
console.log('server running');
