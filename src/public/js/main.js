var date = new Date();

start_time = document.getElementById('start_time');
start_date = document.getElementById('start_date');
end_time = document.getElementById('end_time');
end_date = document.getElementById('end_date');

var todaysDate = date.toISOString().slice(0,10);
var nowTime =  date.getHours() + ':' + date.getMinutes();

end_date.value = todaysDate;
end_time.value = nowTime;
start_date.max = todaysDate;
start_time.max = nowTime;
end_date.max = todaysDate;
end_time.max = nowTime;

start_date.addEventListener('click', function (){
    start_date.max = end_date.value;
});

end_date.addEventListener('click', function (){
    end_date.min = start_date.value;
})

function historicPolyline(){
    let btwDateQuery = "SELECT latitud, longitud FROM gps_data WHERE fecha BETWEEN " + start_date.value.replace(/-/g,"") + " AND "+ end_date.value.replace(/-/g,"");
    console.log(btwDateQuery)
}




// build leaflet map with a specific template
const map = L.map('map-template', {zoomControl: false}).setView([10.965633, -74.8215339], 12.5);const tileURL = 'https://tile.openstreetmap.de/{z}/{x}/{y}.png';
L.tileLayer(tileURL).addTo(map);

var penguinMarker = L.icon({
    iconUrl: 'penguinMarker.png',
    iconSize: [35,39.5],
    shadowSize:   [50, 64],
    iconAnchor:   [10,20],
    shadowAnchor: [4, 62],
    popupAnchor:  [10, -20]
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
    //console.log("respuesta del servidor", responseJson)
    document.getElementById("date").innerHTML = await `${responseJson.dt}`;
    document.getElementById("time").innerHTML = await `${responseJson.tm}`;

    lat = parseFloat(responseJson.lat);
    lon = parseFloat(responseJson.lon);

    if(responseJson.lat != 0){
        map.removeLayer(marker);
        marker = new L.marker([parseFloat(responseJson.lat), parseFloat(responseJson.lon)], {icon: penguinMarker});
        marker.bindPopup("lat:"+responseJson.lat+",lon:"+responseJson.lon);
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

function centerMap() {
    map.setView([lat,lon],14);
}