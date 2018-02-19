<?php
$user = 'moziero_pdd';
$password = 'pdd2016';
$database = 'moziero_pdd';

$p = $_GET['p'];
$i = $_GET['i'];


mysql_connect('localhost', $user, $password);
@mysql_select_db($database) or die("Nie udało się wybrać bazy danych");

$query= "UPDATE produkty SET produkt_string = $p WHERE id = $i";

mysql_query($query);
mysql_close();
?>