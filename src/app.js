// Required Modules
require('dotenv').config();
const express = require('express');
const engine = require('ejs-mate');
const path = require('path');
const dgram = require('dgram');
const cnx = require('./cnx');

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
    console.log("UDP Server on: ", udpPort);
});
let data = [0, 0, 0, 0];
let data_bk = [0, 0, 0, 0];
udp.on('message', (msg) =>{
    data = msg.toString().split("\n");
    if (data_bk[2] !== data[2]){
        cnx.addgpsdata(data[3],data[2],data[0].substr(0,8),data[1].substr(0,9));}
    data_bk = data;
});
udp.bind(udpPort,udpHost);

app.get("/data", (req,res) =>{

    if(data[0] != 0){
        res.json({
            "lat": data[0].substr(0,8),
            "lon": data[1].substr(0,9),
            "tm":  data[2],
            "dt":  data[3],
        });
    }

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
