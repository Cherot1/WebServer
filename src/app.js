// Requiered Modules
const express = require('express');
const engine = require('ejs-mate');
const { application } = require('express');
const path = require('path');
const dgram = require('dgram');
const cnx = require('./cnx');
const mysql = require("mysql");
const {getgpsdata} = require("./cnx");

const app = express();

// setting the server
app.engine('ejs', engine);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views' ));

const conexion = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'HecNoDi152000',
    database: 'gpsdata'
});


// Setting UDP Sniffer
const udp = dgram.createSocket('udp4');
const udpHost = "";
const udpPort = 50000;
// initialization

udp.on('listening', () => {
    console.log("UDP Server on: ", udpPort);
});
var data = ["0","0","0","0"];
udp.on('message', (msg,rinfo) =>{
    data = msg.toString().split("\n");
    console.log("Received data:", data);
});
udp.bind(udpPort,udpHost);
app.get("/data", (req,res) =>{
    res.json({
        "lat": data[0],
        "lon": data[1],
        "tm":  data[2],
        "dt":  data[3],
    });
    cnx.addgpsdata(data[3],data[2],data[0],data[1]);
});


//routes
app.use(require('./routes/index'));
//static files
app.use(express.static( path.join(__dirname, 'public' )));

// starting the server
const port = 80;
app.listen(port, () => {
    console.log("server on port: ",port)
});

cnx.conectar();

app.use();
