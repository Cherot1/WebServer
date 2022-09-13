// build leaflet map with an spific template
const map = L.map('map-template').setView([11.022, -74.869], 13);
const tileURL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';
L.tileLayer(tileURL).addTo(map);

marker = L.marker([11.022, -74.869],13)
marker.bindPopup('11.022 | -74.869');
map.addLayer(marker);

async function getData(){
    const response = await fetch("./data", {});
    let responseJson = await response.json();
    console.log("respuesta del servidor", responseJson)
    document.getElementById("date").innerHTML = await `${responseJson.dt}`;
    document.getElementById("time").innerHTML = await `${responseJson.tm}`;
    document.getElementById("lat").innerHTML = await `${responseJson.lat}`;
    document.getElementById("lon").innerHTML = await `${responseJson.lon}`;

    if(responseJson.lat != 0){
        map.removeLayer(marker);
        marker = new L.marker([parseFloat(responseJson.lat), parseFloat(responseJson.lon)]);
        marker.bindPopup(responseJson.lat+" | "+responseJson.lon);
        map.addLayer(marker);
    }
    
}

let interval = setInterval(()=>{getData()}, 3000);