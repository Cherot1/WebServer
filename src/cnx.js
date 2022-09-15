const mysql = require("mysql");
var pool = mysql.createPool({
    host: process.env.RDS_HOST,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASS,
    database: process.env.RDS_DB,
});

const conectar = () =>{
    pool.getConnection(err => {
        if(err) throw err;
        console.log("Succefull conection!");
    });
}

const addgpsdata = (date, time, latitude, longitude) => {
    //conectar();
    let query = "INSERT INTO gps_data (fecha,hora,latitud,longitud)"
        +"VALUES ('"+date+"','"+time+"','"+latitude+"','"+longitude+"')";
    pool.query(query, function (err) {
        if(err) throw err;
    })
}

const getgpsdata = () => {
    let query = "SELECT fecha, hora, latitud, longitud FROM gps_data ORDER BY ID DESC LIMIT 1";
    pool.query(query,function (err, result) {
        if(err) throw err;
        console.log(result[0].fecha);
    })
}

module.exports = {
    conectar,
    addgpsdata,
    getgpsdata
}


