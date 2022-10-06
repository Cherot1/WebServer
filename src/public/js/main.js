var date = new Date();

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

// LEAFLET SETTINGS
// build leaflet map with a specific template
const map = L.map('map-template', {zoomControl: true}).setView([10.965633, -74.8215339], 12);const tileURL = 'https://tile.openstreetmap.de/{z}/{x}/{y}.png';
L.tileLayer(tileURL).addTo(map);

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
})

//Giving an initial value to the marker
marker = L.marker([11, -74], {icon: penguinMarker})

var polyline;
var polylinePoints;
let lat = 0;
let lon = 0;
let prelat = 0;
let prelon = 0;
var polylineHist;


async function getData(){
    const response = await fetch("./data", {});
    let responseJson = await response.json();
    //console.log("respuesta del servidor", responseJson)
    document.getElementById("date").innerHTML = await `${responseJson.dt}`;
    document.getElementById("time").innerHTML = await `${responseJson.tm}`;

    lat = parseFloat(responseJson.lat);
    lon = parseFloat(responseJson.lon);

    if(responseJson.lat !== 0){
        map.removeLayer(marker);
        marker = new L.marker([parseFloat(responseJson.lat), parseFloat(responseJson.lon)], {icon: penguinMarker});
        marker.bindPopup("lat:"+responseJson.lat+",lon:"+responseJson.lon);
        map.addLayer(marker);

        polylinePoints = [[prelat, prelon], [lat, lon] ]

        if (prelat !== 0){
            polyline = L.polyline(polylinePoints).addTo(map)
        }
    }
    prelat = lat;
    prelon = lon;
}
setInterval(()=>{getData()}, 3000);


function centerMap() {
    map.setView([lat,lon],15);
}

button = document.getElementById('historics');
button.addEventListener("click", async (event) =>{
    map.removeLayer(polylineHist);
    if (start_date.value === end_date.value){
        if (start_time.value+":00" > end_time.value+":00"){
            alert('Por favor, escoja una hora inicial menor a la hora final')
        }
    }

    const data = {
        sdate_time: start_date.value + " " + start_time.value,
        edate_time: end_date.value + " " + end_time.value};

    const res  = await fetch("/moment", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });
    const historicData = await res.json();
    gpsHistoricData = historicData.data
    
    for (var i = 1; i < gpsHistoricData.length; i++){
        origin = [parseFloat(gpsHistoricData[i-1].latitud),parseFloat(gpsHistoricData[i-1].longitud)];
        destin = [parseFloat(gpsHistoricData[i].latitud),parseFloat(gpsHistoricData[i].longitud)];
        var polylineHistPoints = [origin,destin];
        polylineHist=L.polyline(polylineHistPoints, { color: 'black', with: 2.0 }).addTo(map);
        
    }
 })


histMarker = L.marker([11.027, -74.669], {icon: histPenguinMarker});
map.on('mousemove', async(e) => {
    if(pickingMap){
        histMarker = histMarker.setLatLng(e.latlng);
        map.addLayer(histMarker);

        const data = {
            latp    : e.latlng.lat,
            longp   : e.latlng.lng,
            sdate_time: start_date.value + " " + start_time.value,
            edate_time: end_date.value + " " + end_time.value
            
        };

        const res  = await fetch("/place", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        const historicPlace = await res.json();
        placeHistoricData = historicPlace.datap;

       try{
            document.getElementById('RegisterDiv').remove();
        } catch (err){

        }

        var div = document.createElement("ul");
        div.setAttribute("id", "RegisterDiv");
        div.append(document.createElement('br'))

        document.getElementById('boxTitle').innerHTML = "El móvil estuvo en el punto seleccionado: "

        if(placeHistoricData.length === 0){
            document.getElementById('boxTitle').innerHTML = "El móvil NO ha estado en el punto seleccionado "
        }

        let cont = 0;
        for (var i = 0; i < placeHistoricData.length; i++){
            var item = document.createElement('li');

            let date = new Date(placeHistoricData[i].fecha_hora);
            item.innerHTML = "El día " +date.toLocaleDateString('en-ZA')+ " a las " + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2)+ ":" + ("0" + date.getSeconds()).slice(-2);
            div.append(item);

            if(cont===20){
                break;
            }
        }
        document.getElementById('register').append(div);
    }
});