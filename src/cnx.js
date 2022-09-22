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

const addGpsData = (date, time, latitude, longitude) => {
    let query = "INSERT INTO gps_data (fecha,hora,latitud,longitud)"
        +"VALUES ('"+date+"','"+time+"','"+latitude+"','"+longitude+"')";
    pool.query(query, function (err) {
        if(err) throw err;
    })
}

module.exports = {
    pool,
    connect,
    addGpsData
}