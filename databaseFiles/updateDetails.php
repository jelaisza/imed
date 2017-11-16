




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
// Fetching the updated data & storin in new variables
$data = json_decode(file_get_contents("php://input"));
// Escaping special characters from updated data
$r_drugname = mysqli_real_escape_string($con, $data->r_drugname);
$r_dosage = mysqli_real_escape_string($con, $data->r_dosage);
$r_schedule = mysqli_real_escape_string($con, $data->r_schedule);
$r_perhour = mysqli_real_escape_string($con, $data->r_perhour);
$r_doctorname = mysqli_real_escape_string($con, $data->r_doctorname);
$r_licenced = mysqli_real_escape_string($con, $data->r_licenced);

// mysqli query to insert the updated data
$query = "UPDATE tbl_receta SET r_drugname='$r_drugname',r_dosage='$r_dosage',r_schedule='$r_schedule',r_perhour='$r_perhour', r_doctorname='$r_doctorname',r_licenced='$r_licenced' WHERE r_ID=$r_ID";
mysqli_query($con, $query);
echo true;
?>
