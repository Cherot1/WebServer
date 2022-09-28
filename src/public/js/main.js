var date = new Date();
var lati;
var long;
start_time = document.getElementById('start_time');
start_date = document.getElementById('start_date');
end_time = document.getElementById('end_time');
end_date = document.getElementById('end_date');

var todaysDate = date.toISOString().slice(0,10);

hours = date.getHours();
if(parseInt(hours) < 10){
    hours = '0'+date.getHours();
}
minutes = date.getMinutes();
if(parseInt(minutes)<9){
    minutes = '0'+date.getMinutes();
}
nowTime = hours+':'+minutes;

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


// build leaflet map with a specific template
const map = L.map('map-template', {zoomControl: true}).setView([10.965633, -74.8215339], 12.5);const tileURL = 'https://tile.openstreetmap.de/{z}/{x}/{y}.png';
L.tileLayer(tileURL).addTo(map);

var penguinMarker = L.icon({
    iconUrl: 'penguinMarker.png',
    iconSize: [35,39.5],
    shadowSize:   [50, 64],
    iconAnchor:   [10,20],
    shadowAnchor: [4, 62],
    popupAnchor:  [10, -20]
})
var pinguino = L.icon({
    iconUrl: 'pinguino.png',
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


button = document.getElementById('historics');
button.addEventListener("click", async (event) =>{
    const data = {
        sdate: start_date.value,
        stime: start_time.value,
        edate: end_date.value,
        etime: end_time.value};

    const res  = await fetch("/moment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const historicData = await res.json();
    gpsHistoricData = historicData.data
    
    var arr1 = [];
    var arr2 = [];
    for (var i = 1; i < gpsHistoricData.length; i++){
        origin = [parseFloat(gpsHistoricData[i-1].latitud),parseFloat(gpsHistoricData[i-1].longitud)];
        destin = [parseFloat(gpsHistoricData[i].latitud),parseFloat(gpsHistoricData[i].longitud)];
        var polylineHistPoints = [origin,destin];
        arr1.push(parseFloat(gpsHistoricData[i-1].latitud) - parseFloat(gpsHistoricData[i].latitud))
        arr2.push(parseFloat(gpsHistoricData[i-1].longitud) - parseFloat(gpsHistoricData[i].longitud))
        if(arr1[arr1.length - 1] <= 0.00080333){
            if(arr1[arr2.length - 1] <= 0.000207845){
                L.polyline(polylineHistPoints, { color: 'black', with: 2.0 }).addTo(map);
            }
        } 
    }    
 })

var cont=0;
function onMapClick(e) {
    if (cont==0){
         marker1 = new L.marker(e.latlng, {draggable:'true', icon: pinguino});
    }
    marker1.on('dragend', function(event){
      var marker1 = event.target;
      var position = marker1.getLatLng();
      marker1.setLatLng(new L.LatLng(position.lat, position.lng),{draggable:'true'});
      map.panTo(new L.LatLng(position.lat, position.lng));
      marker1.bindPopup("Fecha:"+placeHistoricData.fecha+",Hora:"+placeHistoricData.hora);
      lati=position.lat;
      long=position.lng;
      console.log(lati);
      console.log(long);
    });

    map.addLayer(marker1);
    cont=cont+1;
}

  
map.on('click', onMapClick);

async function marcador(){
    const datap = {

        latp: lati,
        longp: long,
        };


    const resp  = await fetch("/place", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(datap),
    });
    console.log(datap);
    const historicPlace = await resp.json();
    placeHistoricDatap = historicPlace.datap;
    console.log(placeHistoricDatap);
}

let inte = setInterval(()=>{marcador()}, 5000)

