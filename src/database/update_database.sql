#Delete null values from database
delete from gps_data where latitud is null;

 #Create a new datetime column called fecha_hora
alter table gps_data add fecha_hora datetime;

 #Fill the column with fecha and hora data
update gps_data set fecha_hora=cast(fecha as datetime)+cast(hora as time);

#Delete fecha column
alter table gps_data drop column fecha;

#Delete hora column
alter table gps_data drop column hora;