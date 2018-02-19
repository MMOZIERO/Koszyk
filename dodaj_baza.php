<?php
$user = 'moziero_pdd';
$password = 'pdd2016';
$database = 'moziero_pdd';

$q = $_GET['p'];


mysql_connect('localhost', $user, $password);
@mysql_select_db($database) or die("Nie udało się wybrać bazy danych");

$query= "INSERT INTO produkty VALUES ('', '$q')";

mysql_query($query);
$last_id = mysql_insert_id();
echo $last_id;
mysql_close();
?>