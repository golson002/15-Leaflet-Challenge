// Link to GEOJson URL
var earthquakeURL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson';

// Add a tile layer (the background map image) to our map.
var base = L.tileLayer("https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'", {
    attribution:
        'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
});

var myMap = L.map("map", {
    center: [
        40, -98
    ],
    zoom: 4.5,
});

base.addTo(myMap);

function newMap(earthquakeData) {
    var earthquakes = new L.LayerGroup()

    // Define a function to give each feature a popup that describes the place, magnitude, and time of the earthquake.
    function onEachFeature(feature, layer) {
        layer.bindPopup("<h3>Location: " + feature.properties.place + "</h3><hr><p>Magnitude: " + feature.properties.mag + "</p><p>Depth: " + feature.geometry.coordinates[2] + "</p><p>" + new Date(feature.properties.time) + "</p>");
    }

    // Define a function for the color and size of the markers
    function colorMarkers(feature) {
        depth = feature.geometry.coordinates[2]
        var color = "";

        if (depth > 90) {
            color = "#ea2c2c";
        }

        else if (depth > 70) {
            color = "#ea822c";
        }

        else if (depth > 50) {
            color = "#ee9c00";
        }

        else if (depth > 30) {
            color = "#eecc00";
        }

        else if (depth > 10) {
            color = "#d4ee00";
        }

        else {
            color = "#98ee00";
        }

        return color;
    };

    function sytleInfo (feature){
        var geojsonMarkerOptions = {
            radius: getRadius(feature.properties.mag),
            fillColor: colorMarkers(feature),
            color: "#000000",
            weight: 0.5,
            opacity: 1,
            stroke: true, 
            fillOpacity: 1
        };
        return geojsonMarkerOptions
    };

    function getRadius (magnitude) {
        if (magnitude === 0) return 1;
        return magnitude * 4
    };

    L.geoJSON(earthquakeData, {
        onEachFeature: (feature, layer)=> onEachFeature (feature, layer),
        pointToLayer: (feature, latlng) => L.circleMarker(latlng), 
        style: sytleInfo
    }).addTo(earthquakes);

    earthquakes.addTo(myMap);
    console.log(earthquakeData)
    
    // Add a legend to the map
    var legend = L.control({position: "bottomright"})
    legend.onAdd = function () {
        var div = L.DomUtil.create("div", "legend");
        div.innerHTML += '<i style="background: #98ee00"></i><span>-10-10</span><br>';
        div.innerHTML += '<i style="background: #d4ee00"></i><span>10-30</span><br>';
        div.innerHTML += '<i style="background: #eecc00"></i><span>30-50</span><br>';
        div.innerHTML += '<i style="background: #ee9c00"></i><span>50-70</span><br>';
        div.innerHTML += '<i style="background: #ea822c"></i><span>70-90</span><br>';
        div.innerHTML += '<i style="background: #ea2c2c"></i><span>90+</span><br>';
        return div;
    };

    legend.addTo(myMap);
};

// Pull in the earthquake data
d3.json(earthquakeURL).then(
    function (response) {
        newMap(response);
    }
);

