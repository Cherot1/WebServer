const mysql = require("mysql");
let conx

const conexion = () =>{ 
     conx= mysql.createConnection({
    host: process.env.RDS_HOST,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASS,
    database: process.env.RDS_DB,
    });
}

const conectar = () =>{
    conx.connect(err => {
        if(err) throw err;
        console.log("Succefull conection!");
    });
}

const addgpsdata = (date, time, latitude, longitude) => {
    //conectar();
    let query = "INSERT INTO gps_data (fecha,hora,latitud,longitud)"
        +"VALUES ('"+date+"','"+time+"','"+latitude+"','"+longitude+"')";
    conexion.query(query, function (err) {
        if(err) throw err;
    })
    conexion.end();
}

const getgpsdata = () => {
    conectar();
    let query = "SELECT * FROM data ORDER BY ID DESC LIMIT 1";
    conexion.query(query,function (err, result) {
        if(err) throw err;
        console.log(result)
        return result;
    })
}

module.exports = {
    conectar,
    addgpsdata,
    getgpsdata
}


