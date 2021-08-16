import 'ol/ol.css';
import {Collection, Feature, Map, View} from 'ol';
import GeoJSON from 'ol/format/GeoJSON';
import Point from 'ol/geom/Point';
import TileLayer from 'ol/layer/Tile';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import XYZ from 'ol/source/XYZ';
import { fromLonLat, toLonLat } from 'ol/proj';
import OSM from 'ol/source/OSM';
import {Fill, Icon, Stroke, Style, Text} from 'ol/style';
import SourceVector from 'ol/source/Vector';
import LayerVector from 'ol/layer/Vector';

//Style Icons
var iconStyle = new Style({
  image: new Icon(({
    anchor: [0.5, 18], 
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: 'https://www.dropbox.com/s/fx852dq393bwjj3/icon.png?dl=1'
  }))
});

// Initialize Map
const map = new Map({
  target: 'map',
  layers: [
    new TileLayer({
      source: new OSM(),
    }),
  ],
  view: new View({
    center: fromLonLat([15.696389, 48.286111]),
    zoom: 14,
  }),
});

//Place Icons ()
$.getJSON("https://paul42812.github.io/hzbg-assets/data.json", function( data ) {

  var icons = []

  for(var i = 0; i < data.icons.length; i++) {
    var obj = data.icons[i];
    
    icons.push(
      new Feature({
        geometry: new Point(fromLonLat([obj.lonlat[0], obj.lonlat[1]])),
        type: obj.type,
        text: obj.text,
        images: [obj.images]
      })
    );
  }

  icons.forEach(element => {
    element.setStyle(iconStyle)
  });

  var vectorSource = new SourceVector({
    features: icons
  });

  var vectorLayer = new LayerVector({
    source: vectorSource
  });

  map.addLayer(vectorLayer);
});

/* Click On Icons */
map.on('click', function(e) {
    var f = map.forEachFeatureAtPixel(
        e.pixel,
        function(ft, layer){return ft;}
    );
    if (f && f.get('type') == 'click') {
        var geometry = f.getGeometry();
        var coord = geometry.getCoordinates();
        
        var ghprefix = "https://paul42812.github.io/hzbg-assets/low/"
        img = f.get('images')[0][0].replace("src/", ghprefix);
        document.getElementById("gallery").src = img;
    } 
});