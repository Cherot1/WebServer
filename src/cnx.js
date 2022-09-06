const mysql = require("mysql");
const e = require("express");
const conexion = mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DB,
});

const conectar = () =>{
    conexion.connect(err => {
        if(err) throw err;
        console.log("Succefull conection!");
    });
}

const addgpsdata = (date, time, latitude, longitude) => {
    //conectar();
    let query = "INSERT INTO data (fecha,hora,latitud,longitud)"
        +"VALUES ('"+date+"','"+time+"','"+latitude+"','"+longitude+"')";
    conexion.query(query, function (err, result) {
        if(err) throw err;
    })
}

const getgpsdata = () => {
    let query = "SELECT * FROM data ORDER BY ID DESC LIMIT 1";
    conexion.query(query,function (err, result) {
        if(err) throw err;
        return result;
    })
}

module.exports = {
    conectar,
    addgpsdata,
    getgpsdata
}


