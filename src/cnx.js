const mysql = require("mysql");
<<<<<<< HEAD
const conexion = mysql.createConnection({
=======
var pool = mysql.createPool({
>>>>>>> d7121e11c5cd28d5a1ea7e41503b16a0611cbc3f
    host: process.env.RDS_HOST,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASS,
    database: process.env.RDS_DB,
});

const conectar = () =>{
<<<<<<< HEAD
    conexion.connect(err => {
=======
    pool.getConnection(err => {
>>>>>>> d7121e11c5cd28d5a1ea7e41503b16a0611cbc3f
        if(err) throw err;
        console.log("Succefull conection!");
    });
}

const addgpsdata = (date, time, latitude, longitude) => {
    //conectar();
    let query = "INSERT INTO gps_data (fecha,hora,latitud,longitud)"
        +"VALUES ('"+date+"','"+time+"','"+latitude+"','"+longitude+"')";
<<<<<<< HEAD
    conexion.query(query, function (err) {
=======
    pool.query(query, function (err) {
>>>>>>> d7121e11c5cd28d5a1ea7e41503b16a0611cbc3f
        if(err) throw err;
    })
}

const getgpsdata = () => {
<<<<<<< HEAD
    let query = "SELECT * FROM data ORDER BY ID DESC LIMIT 1";
    conexion.query(query,function (err, result) {
        if(err) throw err;
        return result;
=======
    let query = "SELECT fecha, hora, latitud, longitud FROM gps_data ORDER BY ID DESC LIMIT 1";
    pool.query(query,function (err, result) {
        if(err) throw err;
        return result[0].fecha;
>>>>>>> d7121e11c5cd28d5a1ea7e41503b16a0611cbc3f
    })
}

module.exports = {
    conectar,
    addgpsdata,
    getgpsdata
}


