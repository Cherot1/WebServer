// IMPORT REQUIRED MODULES
//-----------------------------------------------------
require('dotenv').config();
const express = require('express');     //Node.js web application framework
const engine = require('ejs-mate');          //simple templating language that lets generate HTML markup with plain JavaScript
const path = require('path');           //provides utilities for working with file and directory paths
const cnx = require('./cnx');           //import cns.js modules
const dgram = require('dgram');         //provides an implementation of UDP datagram sockets.
const moment = require("moment");
const {checkNewUsers, createTableIfNotExist} = require("./cnx");       //module that allows change date format
//------------------------------------------------------

const app = express();

// setting the web server template
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


let data = [0, 0, 0, 0, 0]; // data[0]: Lat, data[1]: Lon, data[2]: Time, data[3]: Date
let data_bk;

udp.on('message', (msg) =>{
    data = msg.toString().split("\n");
    console.log(data)
    createTableIfNotExist(data[4])
    if(data[1] !== 'null'){
        if (data_bk !== data[1]){
            date_time = data[3] + " " + data[2];
            cnx.addGpsData(data[0],data[1],date_time, data[4]);
        }
        data_bk = data[1];
    }


});
udp.bind(udpPort,udpHost);

var tablesDB = ['','']
cnx.pool.query("SHOW TABLES", (err,rows) => {
    if (err) throw err;
    tablesDB[0] = rows[rows.length-1].Tables_in_gpsdata;
    tablesDB[1] = rows[rows.length-2].Tables_in_gpsdata;
})

app.get("/data", (req,res) =>{
    if(data[0]===0 ){
        cnx.pool.query("SELECT latitud, longitud, fecha_hora FROM gps_data ORDER BY ID DESC LIMIT 1", (err,rows) => {
            res.json({
                "lat"   : rows[0].latitud,
                "lon"   : rows[0].longitud,
                "tm"    : moment(rows[0].fecha_hora).format('HH:mm:ss'),
                "dt"    : moment(rows[0].fecha_hora).format("DD/MM/YYYY"),
            });
        });

    } else if(data[0] !== 'null') {
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
    let btwDateQuery =  `SELECT latitud, longitud, fecha_hora FROM `+ tablesDB[parseInt(req.body.car)] +` WHERE (fecha_hora BETWEEN '${req.body.sdate_time}' AND '${req.body.edate_time}')`;

    cnx.pool.query(btwDateQuery, (err,rows) => {
        if (err) throw err;
        res.json({
            "data" : rows
        })
    });
});+


app.post("/place", (req,res) =>{
    let querym=     "SELECT fecha_hora FROM gps_data WHERE (fecha_hora BETWEEN '"+req.body.sdate_time+"' AND '"+req.body.edate_time+"') AND (latitud BETWEEN "
                    + "('"+req.body.latp+"'*0.99997) and ('"+req.body.latp+"'*1.00005) and longitud BETWEEN "
                    + "('"+req.body.longp+"'*1.00005) and ('"+req.body.longp+"'*0.99997))";

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