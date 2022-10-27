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

const addGpsData = (latitude, longitude, date_time, user) => {
    let query = "INSERT INTO  user_"+user+" (latitud,longitud, fecha_hora)"
        +"VALUES ('"+latitude+"','"+longitude+"','"+date_time+"')";
    pool.query(query, function (err) {
        if(err) throw err;
    })
}

const checkNewUsers = (user) => {
    let query = `INSERT IGNORE INTO UsersTable (User) VALUES ('${user}')`
    pool.query(query, function (err) {
        if(err) throw err;
    })
}

const createTableIfNotExist = (user) => {
    let query = `CREATE TABLE IF NOT EXISTS user_`+user+` (id INT AUTO_INCREMENT PRIMARY KEY ,latitud DOUBLE, longitud DOUBLE,fecha_hora DATETIME)`;
    pool.query(query, function (err) {
        if(err) throw err;
    })
}

module.exports = {
    pool,
    connect,
    addGpsData,
    checkNewUsers,
    createTableIfNotExist
}