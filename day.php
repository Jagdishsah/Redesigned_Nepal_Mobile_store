<?php
$server = "localhost";
$user = "root";
$password = "";
$db_name="day";
$conn = new mysqli($server,$user,$password,$db_name);
if($conn->connect_error)
{ 
    die("connection failed".$conn->connect_error);
}
$name =$_POST['username'];
$email =$_POST['email'];
$pwd=$_POST['password'];
$sql = "INSERT INTO daya(Name,Address,Password)VALUES('$name','$email','$pwd')";
if($conn->query($sql) === TRUE)

{
echo "inserted";
}
else { 
echo "table not found";
}

$conn->close();