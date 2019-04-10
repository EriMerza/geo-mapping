//earthquake data
var EarthquakeLink = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson"

//tectonic plates
var TectonicPlatesLink = "https://raw.githubusercontent.com/fraxen/tectonicplates/master/GeoJSON/PB2002_boundaries.json"

//request
d3.json(EarthquakeLink, function(data) {
    createFeatures(data.features);
});

function createFeatures(earthquakeData) {       

  //geojson
  var earthquakes = L.geoJson(earthquakeData, {
    onEachFeature: function (feature, layer){
      layer.bindPopup("<h3>" + feature.properties.place + "<br> Magnitude: " + feature.properties.mag +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
    },
    pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        {radius: getRadius(feature.properties.mag),
          fillColor: getColor(feature.properties.mag),
          fillOpacity: .7,
          stroke: true,
          color: "black",
          weight: .5
      })
    }
  });
  createMap(earthquakes)
}

function createMap(earthquakes) {

  var satelliteMap = L.tileLayer("https://api.mapbox.com/styles/v1/ruchichandra/cjakahzysbllh2rl87e2dg27b/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicnVjaGljaGFuZHJhIiwiYSI6ImNqYzJ2dXlvcDA2a2gycW4zb2RkOXpmZjgifQ.EABSXTlj3gpJcvk8zJL2DQ");

  var outdoorMap = L.tileLayer("https://api.mapbox.com/styles/v1/ruchichandra/cjc2vqswz0efp2rpfjnhunj68/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicnVjaGljaGFuZHJhIiwiYSI6ImNqYzJ2dXlvcDA2a2gycW4zb2RkOXpmZjgifQ.EABSXTlj3gpJcvk8zJL2DQ");

  var lightMap = L.tileLayer("https://api.mapbox.com/styles/v1/ruchichandra/cjc2wvic01j3l2rpbfsypf8qk/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoicnVjaGljaGFuZHJhIiwiYSI6ImNqYzJ2dXlvcDA2a2gycW4zb2RkOXpmZjgifQ.EABSXTlj3gpJcvk8zJL2DQ");

  

  var baseMaps = {
    "Satellite Map": satelliteMap,
    "Outdoor Map": outdoorMap,
    "Light Map": lightMap
  };

  var tectonicPlates = new L.LayerGroup();

  var overlayMaps = {
    Earthquakes: earthquakes,
    "Tectonic Plates": tectonicPlates
  };

  var myMap = L.map("map", {
    center: [31.7, -7.09],
    zoom: 2.5,
    layers: [lightMap, earthquakes, tectonicPlates]
  });

   d3.json(TectonicPlatesLink, function(plateData) {
     L.geoJson(plateData, {
       color: "blue",
       weight: 2
     })
     .addTo(tectonicPlates);
   });

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);

  var legend = L.control({position: 'bottomright'});

  legend.onAdd = function (myMap) {

    var div = L.DomUtil.create('div', 'info legend'),
              grades = [0, 1, 2, 3, 4, 5],
              labels = [];

    for (var i = 0; i < grades.length; i++) {
        div.innerHTML +=
            '<i style="background:' + getColor(grades[i] + 1) + '"></i> ' +
            grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };

  legend.addTo(myMap);
}

function getColor(d) {
  return d > 5 ? '#F30' :
  d > 4  ? '#F60' :
  d > 3  ? '#F90' :
  d > 2  ? '#FC0' :
  d > 1   ? '#FF0' :
            '#9F3';
}

function getRadius(value){
  return value*40000
}
