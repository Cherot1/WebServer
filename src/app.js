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
    console.log(data)
    if (data_bk[2] !== data[2]){
        cnx.addGpsData(data[3],data[2],data[0],data[1]);}
    data_bk = data;
});
udp.bind(udpPort,udpHost);


app.get("/data", (req,res) =>{
    if(data[0]===0){
        cnx.pool.query("SELECT fecha, hora, latitud, longitud FROM gps_data ORDER BY ID DESC LIMIT 1", (err,rows) => {
            res.json({
                "lat"   : rows[0].latitud,
                "lon"   : rows[0].longitud,
                "tm"    : rows[0].hora,
                "dt"    : moment(rows[0].fecha).format("DD/MM/YYYY"),
            });
        });
    } else {
        res.json({
            "lat"   : data[0],
            "lon"   : data[1],
            "tm"    : data[2],
            "dt"    : moment(data[3]).format("DD/MM/YYYY"),
        })
    }
});

app.use(express.json({limit: '1mb'}));
app.post("/moment", (req,res) =>{

    let btwDateQuery =  "SELECT latitud, longitud FROM gps_data WHERE ( fecha = '"+req.body.sdate+"' AND hora > '"+req.body.stime+":00' )"
                        + "OR ( fecha > '" +req.body.sdate+"' AND fecha < '"+req.body.edate+"' )"
                        + "OR ( fecha = '"+req.body.edate+"' AND hora < '"+req.body.etime+":00' )";

    cnx.pool.query(btwDateQuery, (err,rows) => {
        if (err) throw err;
        res.json({
            "data" : rows
        })
    });
});

app.post("/place", (req,res) =>{
    let querym=     "SELECT DISTINCT fecha, hora FROM gps_data WHERE latitud BETWEEN "
                    + "('"+req.body.latp+"'*0.99997) and ('"+req.body.latp+"'*1.00005) and longitud BETWEEN "
                    + "('"+req.body.longp+"'*1.00005) and ('"+req.body.longp+"'*0.99997)"


    cnx.pool.query(querym, (err,rows) => {
        if (err) throw err;
        res.json({
            "datap" : rows
        })
    });
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

cnx.connect();