// Required Modules
require('dotenv').config();
const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const dgram = require('dgram');

const cnx = require('./cnx');
const moment = require("moment");

const app = express();

// setting the server
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views' ));


// Setting UDP Sniffer
const udp = dgram.createSocket('udp4');
const udpHost = "";
const udpPort = parseInt(process.env.UDP_PORT);


// initialization
udp.on('listening', () => {
console.log("UDP Server:  ", udpPort);
});

let data = [0, 0, 0, 0];
let data_bk = [0, 0, 0, 0];
udp.on('message', (msg) =>{
    data = msg.toString().split("\n");
    if (data_bk[2] !== data[2]){
        cnx.addGpsData(data[3],data[2],data[0],data[1]);}
    data_bk = data;
});
udp.bind(udpPort,udpHost);


app.get("/data", (req,res) =>{
    cnx.pool.query("SELECT fecha, hora, latitud, longitud FROM gps_data ORDER BY ID DESC LIMIT 1", (err,rows) => {
            res.json({
                "lat": rows[0].latitud,
                "lon": rows[0].longitud,
                "tm":  rows[0].hora,
                "dt":  moment(rows[0].fecha).format("DD/MM/YYYY"),
            });
    });
});

app.use(express.json({limit: '1mb'}));
app.post("/moment", (req,res) =>{
    console.log(req.body.sdate);
    let btwDateQuery = "SELECT latitud, longitud FROM gps_data WHERE fecha BETWEEN "
        + req.body.sdate.replace(/-/g,"") + " AND "
        + req.body.edate.replace(/-/g,"");
    console.log(btwDateQuery)


})

/*
*/



//routes
app.use(require('./routes/index'));
//static files
app.use(express.static( path.join(__dirname, 'public' )));

// starting the server
const port = 80;
app.listen(port, () => {
    console.log("server on port: ",port)
});

cnx.connect();