<?php
session_start();
error_reporting(0);
require_once 'config.php';
$loggedIn = false;

if(empty($password)){
	die('No password set! Please edit auth.php');
}

if($_SESSION['password'] == $password){
	$loggedIn = true;
	error_reporting(E_ALL);
}

function page_login(){
	global $tries, $password;
	$left = $tries-$_SESSION['wrongcount'];
	if($left > 0):
?>
<form action="backend.php" method="POST">
<?php if(isset($_SESSION['wrongcount'])): ?>
	<p>Wrong password! You have <?php print $left ?> tries left.</p>
<?php endif; ?>
	Enter password: <input type="password" name="password">
	<input type="submit" value="Submit">
</form>
<?php
	else:
	print "Too many incorrect password tries. Form locked.";
	endif;
}

function check_login(){
	global $loggedIn, $tries, $password;
	if(!empty($_POST['password'])){
		$left = $tries-$_SESSION['wrongcount'];
		if($_POST['password'] == $password && $left > 0){
			$_SESSION['password'] = $password;
			return true;
		}else{
			$_SESSION['wrongcount']++;
		}
	}
	if(!$loggedIn){
		page_login();
		return false;
	}
	error_reporting(E_ERROR | E_WARNING);
	return true;
}

function parse_data(){
	@$data = file_get_contents("data/files.json");
	if(!empty($data)){
		return json_decode($data, true);
	}
}
function write_data($d){
	$d = json_encode($d);
	file_put_contents("data/files.json", $d);
}
