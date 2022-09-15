// build leaflet map with an spific template
<<<<<<< HEAD
const map = L.map('map-template').setView([11.022, -74.869], 13);
const tileURL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
L.tileLayer(tileURL).addTo(map);

marker = L.marker([11.022, -74.869],13)
marker.bindPopup('11.022 | -74.869');
map.addLayer(marker);
=======

const map = L.map('map-template', {zoomControl: false}).setView([10.965633, -74.8215339], 12.5);const tileURL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
L.tileLayer(tileURL).addTo(map);

var penguinMarker = L.icon({
    iconUrl: 'penguinMarker.png',
    iconSize: [35,39.5],
    iconAnchor: [0, 38]
})

marker = L.marker([11.022, -74.869], {icon: penguinMarker})
var polyline;
var polylinePoints;
let lat = 0;
let lon = 0;
let prelat = 0;
let prelon = 0;


>>>>>>> d7121e11c5cd28d5a1ea7e41503b16a0611cbc3f

async function getData(){
    const response = await fetch("./data", {});
    let responseJson = await response.json();
    console.log("respuesta del servidor", responseJson)
    document.getElementById("date").innerHTML = await `${responseJson.dt}`;
    document.getElementById("time").innerHTML = await `${responseJson.tm}`;
    document.getElementById("lat").innerHTML = await `${responseJson.lat}`;
    document.getElementById("lon").innerHTML = await `${responseJson.lon}`;
<<<<<<< HEAD

    if(responseJson.lat != 0){
        map.setView([parseFloat(responseJson.lat), parseFloat(responseJson.lon)], 13);
        map.removeLayer(marker);
        marker = new L.marker([parseFloat(responseJson.lat), parseFloat(responseJson.lon)]);
        marker.bindPopup(responseJson.lat+" | "+responseJson.lon);
        map.addLayer(marker);
    }
=======
    lat = parseFloat(responseJson.lat);
    lon = parseFloat(responseJson.lon);

    if(responseJson.lat != 0){
        map.removeLayer(marker);
        marker = new L.marker([parseFloat(responseJson.lat), parseFloat(responseJson.lon)], {icon: penguinMarker});
        marker.bindPopup(responseJson.lat+" | "+responseJson.lon);
        map.addLayer(marker);

        polylinePoints = [[prelat, prelon], [lat, lon] ]

        if (prelat != 0){
            polyline = L.polyline(polylinePoints).addTo(map)
        }
    }
    prelat = lat;
    prelon = lon;
>>>>>>> d7121e11c5cd28d5a1ea7e41503b16a0611cbc3f
    
}

let interval = setInterval(()=>{getData()}, 3000);