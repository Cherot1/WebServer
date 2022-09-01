const express = require('express');
const engine = require('ejs-mate');
const { application } = require('express');
const path = require('path');
// UDP SERVER LISTENING
const dgram = require('dgram');
const udp = dgram.createSocket('udp4');

const udpHost = "";
const udpPort = 50000;
// initialization
const app = express();
const port = 80;
//
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
});

// setting the server 
app.engine('ejs', engine);
app.set('view engine', 'ejs'); 
app.set('views', path.join(__dirname, 'views' ));

//routes
app.use(require('./routes/index'));

//static files
app.use(express.static( path.join(__dirname, 'public' )));

// starting the server
app.listen(port, () => {
    console.log("server on port: ",port)
});
