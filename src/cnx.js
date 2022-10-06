const mysql = require("mysql");
const pool = mysql.createPool({
    host: process.env.RDS_HOST,
    user: process.env.RDS_USER,
    password: process.env.RDS_PASS,
    database: process.env.RDS_DB,
});

const connect = () =>{
    pool.getConnection(err => {
        if(err) throw err;
        console.log("Successful database connection!");
    });
}

const addGpsData = (latitude, longitude, date_time) => {
    let query = "INSERT INTO gps_data (latitud,longitud, fecha_hora)"
        +"VALUES ('"+latitude+"','"+longitude+"','"+date_time+"')";
    pool.query(query, function (err) {
        if(err) throw err;
    })
}

module.exports = {
    pool,
    connect,
    addGpsData
}