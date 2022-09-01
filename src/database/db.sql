--Creating database
CREATE DATABASE gpsdata;

--Using database
use gpsdata;

--creating a table
CREATE TABLE data(
    id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    fecha VARCHAR(30) NOT NULL,
    hora VARCHAR(30) NOT NULL,
    latitud VARCHAR(30) NOT NULL,
    longitud VARCHAR(30) NOT NULL

-- To show all tables
SHOW TABLES;

-- Describe tables
DESCRIBE data;