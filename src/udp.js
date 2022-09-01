const dgram = require('dgram');
const { appendFile } = require('fs');
const udp = dgram.createSocket('udp4');


const udpPort = 5000;

udp.on("Listening", () =>{
    console.log("UDP server on ", udpPort);
});

var recDta = ["0","0","0","0"];
udp.on("message", (msg,rinfo) => {
    recDta = msg.toString().split("\n");
});

export{udp}






