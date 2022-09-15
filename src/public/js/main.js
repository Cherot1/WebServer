// build leaflet map with an spific template

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



async function getData(){
    const response = await fetch("./data", {});
    let responseJson = await response.json();
    console.log("respuesta del servidor", responseJson)
    document.getElementById("date").innerHTML = await `${responseJson.dt}`;
    document.getElementById("time").innerHTML = await `${responseJson.tm}`;
    document.getElementById("lat").innerHTML = await `${responseJson.lat}`;
    document.getElementById("lon").innerHTML = await `${responseJson.lon}`;
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
    
}

let interval = setInterval(()=>{getData()}, 3000);