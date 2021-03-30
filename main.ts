import Point from 'ol/geom/Point';
import * as ol from 'ol';
import OSM from 'ol/source/OSM';
import sVector from 'ol/source/Vector';
import lVector from 'ol/layer/Vector';
import { fromLonLat, toLonLat } from 'ol/proj';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {Icon, Style} from 'ol/style';
import {defaults as defaultInteractions} from 'ol/interaction';
import KeyboardZoom from 'ol/interaction/KeyboardZoom';

var iconStyle = new Style({
  image: new Icon(({
    anchor: [0.5, 18], 
    anchorXUnits: 'fraction',
    anchorYUnits: 'pixels',
    src: 'https://www.dropbox.com/s/fx852dq393bwjj3/icon.png?dl=1'
  }))
});

$.getJSON( "https://paul42812.github.io/hzbg/data.json", function( data ) {

  var icons = []

  for(var i = 0; i < data.icons.length; i++) {
    var obj = data.icons[i];

    console.log(obj)
    
    icons.push(
      new ol.Feature({
        geometry: new Point(fromLonLat([obj.lonlat[0], obj.lonlat[1]])),
        type: obj.type,
        text: obj.text,
        images: [obj.images]
      })
    );
  }

  console.log(icons)

  icons.forEach(element => {
    element.setStyle(iconStyle)
  });

  var vectorSource = new sVector({
    features: icons
  });

  var vectorLayer = new lVector({
    source: vectorSource
  });

  map.addLayer(vectorLayer);
});

/* Initialize map */
var map = new ol.Map({
  layers: [
    new TileLayer({
      source: new OSM(),
    })
  ],
  target: 'map',
  view: new ol.View({
    center: fromLonLat([15.6979, 48.2831]),
    zoom: 15,
    maxZoom: 18,
  }),
  interactions: defaultInteractions({keyboard: false}).extend([new KeyboardZoom()]),
});


/* Change image in browser */
function left(){
  if (typeof imgs[0][index - 1] !== "undefined"){
    index -= 1;
    (document.getElementById('img') as HTMLImageElement).src = "https://paul42812.github.io/hzbg/assets/720p/"+imgs[0][index];
  } 
}

function right(){
  if (typeof imgs[0][index + 1] !== "undefined"){
    index += 1;
    (document.getElementById('img') as HTMLImageElement).src = "https://paul42812.github.io/hzbg/assets/720p/"+imgs[0][index];
  }
}



/* Listener */
var close_btn = document.getElementById("close_btn");
close_btn.addEventListener("click", (e:Event) => hideimg());

var left_btn = document.getElementById("left_btn");
left_btn.addEventListener("click", (e:Event) => left());

var right_btn = document.getElementById("right_btn");
right_btn.addEventListener("click", (e:Event) => right());


/* Show and hide picture browser */
var imgelem = ["img", "black", "close_btn", "right_btn", "left_btn", "txt"]

function showimg(){
  imgelem.forEach(element => {
    document.getElementById(element).style.visibility = "visible";
  });
}

function hideimg(){
  imgelem.forEach(element => {
    document.getElementById(element).style.visibility = "hidden";
  });
  (document.getElementById('img') as HTMLImageElement).src = "";
}


/* Click On Icons */
var imgs; var index; var hedrtext; var ctn = 0;
map.on('click', function(evt) {
    var f = map.forEachFeatureAtPixel(
        evt.pixel,
        function(ft, layer){return ft;}
    );
    if (f && f.get('type') == 'click') {
        var geometry = f.getGeometry();
        var coord = geometry.getCoordinates();
        
        imgs = f.get('images'); index = 0;
        hedrtext = f.get('text');
        document.getElementById('txt').innerHTML = hedrtext;
        (document.getElementById('img') as HTMLImageElement).src = "https://paul42812.github.io/hzbg/assets/720p/"+ (imgs[0][0]);

        ctn = 0;
        while (typeof imgs[ctn] !== "undefined"){
          ctn += 1;
        }

        showimg();
    } 
});

/* Display Coordinates on right click
map.on('contextmenu', function(evt){
  var coords = toLonLat(evt.coordinate);
  var lat = coords[1];
  var lon = coords[0];
  var locTxt = String(lat) + " " + String(lon);
  alert(locTxt)
}); */

/* Keydown */
$(document).on('keydown', function(e) {
  if (e.key === "Escape") { 
    img.style.visibility = "hidden";
    img.removeAttribute('src');
    document.getElementById('map').focus();
    hideimg();
  }

  if (e.key === "ArrowRight") { 
    right();
  }

  if (e.key === "ArrowLeft") { 
    left();
  }

  if (e.key === "e") { 
    window.location.replace("http://hzbg.github.io/editor");
    
  }
});

/* Show other cursor when hovering over features */
map.on('pointermove', function(e){
  var pixel = map.getEventPixel(e.originalEvent);
  var hit = map.hasFeatureAtPixel(pixel);
  map.getViewport().style.cursor = hit ? 'pointer' : '';
});

const img = (document.getElementById('img') as HTMLImageElement);
const black = (document.getElementById('black') as HTMLImageElement);

function OnLoad(){
  UpdateBtn();
  CenterImage();
}

function OnResize(){
  CenterImage();
  UpdateBtn();
}

function UpdateBtn() {
  var btn_l = (document.getElementById('left_btn') as HTMLImageElement);
  var btn_r = (document.getElementById('right_btn') as HTMLImageElement);
  document.getElementById('left_btn').style.top = String($(window).height()/2-btn_l.height/2)+"px";
  document.getElementById('right_btn').style.top = String($(window).height()/2-btn_r.height/2)+"px";

  document.getElementById('txt').style.fontSize = String($(window).height()*(6/100))+"px";
}

function CenterImage(){
  img.style.height = String($(window).height()*(92/100))+"px";
  img.style.width = String((img.naturalWidth*img.height)/img.naturalHeight)+"px";

  img.style.marginLeft = String(-(img.width/2))+"px";
  img.style.marginTop = String(-(img.height/2)+$(window).height()*(4/100)-5)+"px";

  try {
    if (typeof imgs[0][index + 1] == "undefined"){
      document.getElementById('right_btn').style.visibility = "hidden";
    } else {
      document.getElementById('right_btn').style.visibility = "visible";
    }
  } catch { }

  try {
    if (typeof imgs[0][index - 1] == "undefined"){
      document.getElementById('left_btn').style.visibility = "hidden";
    } else {
      document.getElementById('left_btn').style.visibility = "visible";
    }
  } catch { }
  
  if (ctn > 1){
    document.getElementById('txt').innerHTML = ("("+String(index + 1)+"/"+String(ctn)+") "+ hedrtext);
  } else {
    document.getElementById('txt').innerHTML = hedrtext;
  }
}


img.onload = CenterImage;
window.onresize = OnResize;
window.onload = OnLoad;
CenterImage();

img.style.position = "absolute"
img.style.top = "50%";
img.style.left = "50%";