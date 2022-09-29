--Creating database
CREATE DATABASE gpsdata;

--Using database
use gpsdata;

--creating a table
CREATE TABLE gps_data(
         id INT(7) UNSIGNED AUTO_INCREMENT PRIMARY KEY NOT NULL,
         fecha DATE NOT NULL,
         hora TIME NOT NULL,
         latitud VARCHAR(13) NOT NULL,
         longitud VARCHAR(13) NOT NULL
);

-- To show all tables
SHOW TABLES;

-- Describe tables
DESCRIBE gps_data;
