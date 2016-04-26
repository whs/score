<?php
session_start();
error_reporting(0);
require_once 'config.php';

if(empty(PASSWORD)){
	die('ไม่ได้กำหนดรหัสผ่าน! กรุณาแก้ไข config.php');
}

if($_SESSION['password'] == hash('sha512', PASSWORD)){
	define('LOGGED_IN', true);
	error_reporting(E_ALL);
}

function get_tries_left(){
	return TRIES-$_SESSION['wrongcount'] + 1;
}

function page_login(){
	$left = get_tries_left();
	if($left > 0){
		require_once 'templates/login.php';
		login_theme($left);
	}else{
		require_once 'templates/locked.php';
		locked_theme();
	}
}

function check_login(){
	global $loggedIn;
	if(!empty($_POST['password'])){
		$left = get_tries_left();
		if($_POST['password'] == PASSWORD && $left > 0){
			$_SESSION['password'] = hash('sha512', PASSWORD);
			$_SESSION['wrongcount'] = 0;
			return true;
		}else{
			$_SESSION['wrongcount']++;
		}
	}
	if(!defined('LOGGED_IN')){
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
