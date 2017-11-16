



<?php

header('Content-Type: application/json');
if (isset($_SERVER['HTTP_ORIGIN'])) {
  header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
  header('Access-Control-Allow-Credentials: true');
  header('Access-Control-Max-Age: 86400');    // cache for 1 day
}

// Access-Control headers are received during OPTIONS requests
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS");
  if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
    header("Access-Control-Allow-Headers:{$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");
    exit(0);
}



// Including database connections
require_once 'db_connect.php';
// Fetching and decoding the inserted data
$data = json_decode(file_get_contents("php://input"));
// Escaping special characters from submitting data & storing in new variables.

$r_drugname = mysqli_real_escape_string($con, $data->r_drugname);
$r_food = mysqli_real_escape_string($con, $data->r_food);
$r_dosage = mysqli_real_escape_string($con, $data->r_dosage);
$r_dosageform = mysqli_real_escape_string($con, $data->r_dosageform);
$r_time = mysqli_real_escape_string($con, $data->r_time);
$r_schedule = mysqli_real_escape_string($con, $data->r_schedule);
$r_day = mysqli_real_escape_string($con, $data->r_day);
$r_doctorname = mysqli_real_escape_string($con, $data->r_doctorname);
$r_licenced = mysqli_real_escape_string($con, $data->r_licenced);
$r_contact = mysqli_real_escape_string($con, $data->r_contact);
$r_image = mysqli_real_escape_string($con, $data->r_image);

// mysqli insert query
$query = "INSERT into tbl_receta (r_drugname,r_food,r_dosage,r_dosageform,r_time,r_schedule,r_day,r_doctorname,r_licenced,r_contact,r_image) VALUES ('$r_drugname','$r_food','$r_dosage','$r_dosageform','$r_time','$r_schedule','$r_day','$r_doctorname','$r_licenced','$r_contact','$r_image')";
// Inserting data into databaser

mysqli_query($con, $query);
echo true;
?>
