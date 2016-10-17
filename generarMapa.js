var mapnik = require("mapnik");
var fs = require("fs");
// register fonts and datasource plugins
mapnik.register_default_fonts();
mapnik.register_default_input_plugins();
var porCuanto = 3;
var map = new mapnik.Map(256*porCuanto, 256*porCuanto);
map.load("stylesheet.xml", function(err,map) {
    if (err) throw err;
    map.zoomAll();
    var im = new mapnik.Image(256*porCuanto, 256*porCuanto);
    map.render(im, function(err,im) {
        if (err) throw err;
        im.encode("png", function(err,buffer) {
            if (err) throw err;
            fs.writeFile("map.png",buffer, function(err) {
                if (err) throw err;
                console.log("saved map image to map.png");
            });
         });
    });
});
