const date = new Date();

start_datetime = document.getElementById('start_date');
end_datetime = document.getElementById('end_date');

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

end_datetime.value = todaysDate+"T"+nowTime;

end_datetime.max = todaysDate+"T"+nowTime;

start_datetime.addEventListener('click', function (){
    start_datetime.max = end_datetime.value;
});

end_datetime.addEventListener('click', function (){
    end_datetime.min = start_datetime.value;
})

document.getElementById("histCow1").addEventListener("click", function() {
    document.getElementById("histCow2").checked = false;
});
document.getElementById("histCow2").addEventListener("click", function() {
    document.getElementById("histCow1").checked = false;
});





// LEAFLET SETTINGS
// build leaflet map with a specific template
const map = L.map('map-template', {zoomControl: true}).setView([11.02130401,-74.85207962], 17);
//const tileURL = 'https://tile.openstreetmap.de/{z}/{x}/{y}.png';
googleTerrain = L.tileLayer('http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});
googleTerrain.addTo(map);


/* CREATING MARKERS */
//Last position marker
var penguinMarker = L.icon({
    iconUrl: 'penguinMarker.png',
    iconSize: [35,39.5],
    shadowSize:   [50, 64],
    iconAnchor:   [20,40],
    shadowAnchor: [4, 62],
    popupAnchor:  [10, -20]
});

// Historic onClick marker
var histPenguinMarker = L.icon({
    iconUrl: 'penguinHistIcon.png',
    iconSize: [35,39.5],
    shadowSize:   [50, 64],
    iconAnchor:   [20,40],
    shadowAnchor: [4, 62],
    popupAnchor:  [10, -20]
});

var cowMarker_1 = L.icon({
    iconUrl: 'cowMarkerYellow_1.png',
    iconSize: [50,50],
    shadowSize:   [50, 64],
    iconAnchor:   [20,40],
    shadowAnchor: [4, 62],
    popupAnchor:  [10, -20]
});

var cowMarker_2 = L.icon({
    iconUrl: 'cowMarkerRed_1.png',
    iconSize: [50,50],
    shadowSize:   [50, 64],
    iconAnchor:   [20,40],
    shadowAnchor: [4, 62],
    popupAnchor:  [10, -20]
});

markerR = L.marker();
markerB = L.marker();

var geoJson = {"type":"FeatureCollection","features":[{"type":"Feature","geometry":{"type":"Polygon","coordinates":[[[-74.85207962,11.02130401],[-74.85169972,11.02126434],[-74.85110967,11.0212802],[-74.85050345,11.02116913],[-74.84978407,11.02101839],[-74.84927485,11.02106599],[-74.84900003,11.0212326],[-74.84887879,11.02191491],[-74.84990532,11.02396183],[-74.84989723,11.02458066],[-74.85149765,11.02471553],[-74.85179672,11.02312878],[-74.85207154,11.02147855],[-74.85207962,11.02130401]]]},"id":"9182a32e-e1cf-4235-9f0e-aa1e5a76dadb","properties":null}]}
L.geoJSON(geoJson).addTo(map);

var polyline;
var polylinePoints;
let lat = 0;
let lon = 0;
let prelat = 0;
let prelon = 0;
var latR
var lonR
var latB
var lonB
var active_polyline = L.featureGroup().addTo(map);
let cowRegister = []


async function getData(){
    const response = await fetch("./data", {});
    let responseJson = await response.json();
    //console.log("respuesta del servidor", responseJson)
    //document.getElementById("date").innerHTML = await `${responseJson.dt}`;
    //document.getElementById("time").innerHTML = await `${responseJson.tm}`;
    if (!cowRegister.includes(responseJson.id) && responseJson.id !== 0){
        cowRegister.push(responseJson.id);
    }

    lat = parseFloat(responseJson.lat);
    lon = parseFloat(responseJson.lon);

    if(document.getElementById("statusCow1").innerHTML === 'offline'){
        document.getElementById("histCow1").disabled = true;
    }
    if(document.getElementById("statusCow2").innerHTML === 'offline'){
        document.getElementById("histCow2").disabled = true;
    }

    let x;
    if (responseJson.lat !== 0) {
        try {
            if (responseJson.id === cowRegister[0]) {
                map.removeLayer(markerR);
                markerR = new L.marker([parseFloat(responseJson.lat), parseFloat(responseJson.lon)], {icon: cowMarker_1});
                map.addLayer(markerR);

                polylinePoints = [[latR, lonR], [lat, lon] ]
                if (latR !== 0){
                    polyline = L.polyline(polylinePoints).addTo(map)
                }


                latR = responseJson.lat;
                lonR = responseJson.lon
                document.getElementById("idCow1").innerHTML = responseJson.id;
                x = document.getElementById("statusCow1")
                x.innerHTML = "• online";
                document.getElementById("histCow1").disabled = false;
                x.style="text-style: normal; color: lawngreen; font-weight: bold"

            } else if (responseJson.id === cowRegister[1]) {
                map.removeLayer(markerB);
                markerB = new L.marker([parseFloat(responseJson.lat), parseFloat(responseJson.lon)], {icon: cowMarker_2});
                map.addLayer(markerB);

                polylinePoints = [[latB, lonB], [lat, lon] ]
                if (latB !== 0){
                    polyline = L.polyline(polylinePoints).addTo(map)
                }


                latB = responseJson.lat;
                lonB = responseJson.lon
                document.getElementById("idCow2").innerHTML = responseJson.id;
                x = document.getElementById("statusCow2")
                x.innerHTML = "• online";
                document.getElementById("histCow2").disabled = false;
                x.style="text-style: normal; color: lawngreen; font-weight: bold"

            }
        } catch (e) {
            console.log(e)
        }

        /*polylinePoints = [[prelat, prelon], [lat, lon] ]

        if (prelat !== 0){
            polyline = L.polyline(polylinePoints).addTo(map)
        }*/
    }
    prelat = lat;
    prelon = lon;
}
setInterval(()=>{getData()}, 3000);


function centerMap() {
    map.setView([11.02130401,-74.85207962],16);
}

document.querySelector("#imgCow1").addEventListener("click", function (){
    map.setView([latR,lonR],17.3)
});

document.querySelector("#imgCow2").addEventListener("click", function (){
    map.setView([latB,lonB],17.3)
})

let c
button = document.getElementById('historics');
button.addEventListener("click", async (event) =>{
    sdatetime = start_datetime.value.split("T");
    edatetime = end_datetime.value.split("T");
    if (sdatetime[0] === edatetime[0]){
        if (edatetime[1]+":00" > sdatetime[1]+":00"){
            alert('Por favor, escoja una hora inicial menor a la hora final')
        }
    }

    if((!document.getElementById("histCow1").checked) && (!document.getElementById("histCow2").checked)){
        alert('Por favor, seleccione una vaca')
        return
    }


    if(document.getElementById("histCow1").checked){
        c = 0;
    }
    if(document.getElementById("histCow2").checked){
        c = 1;
    }

    const dataL = {
        cow   : String(c),
        sdate_time  : sdatetime[0] + " " + sdatetime[1],
        edate_time  : edatetime[0] + " " + edatetime[1],
    }

    const res  = await fetch("/moment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(dataL),
    });
    const historicData = await res.json();
    gpsHistoricData = historicData.data
    console.log(gpsHistoricData)

    active_polyline.clearLayers();
    for (var i = 1; i < gpsHistoricData.length; i++){
        origin = [parseFloat(gpsHistoricData[i-1].latitud),parseFloat(gpsHistoricData[i-1].longitud)];
        destin = [parseFloat(gpsHistoricData[i].latitud),parseFloat(gpsHistoricData[i].longitud)];
        var polylineHistPoints = [origin,destin];
        L.polyline(polylineHistPoints, { color: 'black', with: 2.0 }).addTo(active_polyline);
    }
 });


let typeMouseMap = 'mousemove';

document.body.onkeyup = function(e) {
    if (e.key === " " ||
        e.code === "Space" ||
        e.keyCode === 32
    ) {
        if (typeMouseMap === 'mousemove'){
            typeMouseMap = 'click'
        } else {
            map.off('click', )
            typeMouseMap = 'mousemove';
        }
        console.log(typeMouseMap)
    }
}

histMarker = L.marker([11.027, -74.669], {icon: histPenguinMarker});
 async function mapType(e) {
     console.log(typeMouseMap)
     if (pickingMap) {
         histMarker = histMarker.setLatLng(e.latlng);
         map.addLayer(histMarker);

         const data = {
             latp: e.latlng.lat,
             longp: e.latlng.lng,
             sdate_time: start_date.value + " " + start_time.value,
             edate_time: end_date.value + " " + end_time.value,
             car: carSelection,
         };

         const res = await fetch("/place", {
             method: "POST",
             headers: {
                 "Content-Type": "application/json",
             },
             body: JSON.stringify(data),
         });

         const historicPlace = await res.json();
         placeHistoricData = historicPlace.datap;

         try {
             document.getElementById('RegisterDiv').remove();
         } catch (err) {

         }

         var div = document.createElement("ul");
         div.setAttribute("id", "RegisterDiv");
         div.append(document.createElement('br'))

         document.getElementById('boxTitle').innerHTML = "El móvil estuvo en el punto seleccionado: "

         if (placeHistoricData.length === 0) {
             document.getElementById('boxTitle').innerHTML = "El móvil NO ha estado en el punto seleccionado "
         }

         let cont = 0;
         for (var i = 0; i < placeHistoricData.length; i++) {
             var item = document.createElement('li');

             let date = new Date(placeHistoricData[i].fecha_hora);
             item.innerHTML = "El día " + date.toLocaleDateString('en-ZA') + " a las " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":" + ("0" + date.getSeconds()).slice(-2);
             div.append(item);
             cont++;
             if(cont===20){
                 break;
             }d

         }
         document.getElementById('register').append(div);
     }

 }


