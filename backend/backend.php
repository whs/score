<?php
ob_start();
require "auth.php";
if(check_login()){
	$data = parse_data();

	$themeData = array(
		"warn_unwritable" => !is_writable("data") || !is_writable("data/files.json") || !is_writable("input"),
		"warn_encryption_insecure" => ENCRYPTION_KEY === "default" || empty(ENCRYPTION_KEY),
	);

	// create new file
	if(!empty($_POST['new'])){
		$fileID = uniqid();
		mkdir("data/".$fileID);
		file_put_contents("data/".$fileID."/index.html", '<meta http-equiv="refresh" content="0;url=../../">');
		$data[] = array(
			"id" => $fileID,
			"name" => $_POST['new']
		);
		write_data($data);
	}else if(!empty($_POST['delete'])){
		$found = false;
		foreach($data as $ind => $item){
			if($item['id'] == $_POST['delete']){
				$found = &$item;
				unset($data[$ind]);
				break;
			}
		}
		foreach(glob("data/".$_POST['delete']."/*") as $f){
			unlink($f);
		}
		rmdir("data/".$_POST['delete']);
		write_data($data);
	}else if(isset($_FILES['upload'])){
		if(empty($_POST['name'])){
			$themeData['error'] = "ยังไม่ได้เลือกไฟล์";
		}else if($_FILES['upload']['error']){
			$themeData['error'] = "อัพโหลดไฟล์ล้มเหลว";
		}else{
			$found = false;
			foreach($data as &$item){
				if($item['id'] == $_POST['name']){
					$found = &$item;
					break;
				}
			}
			if($found){
				$txt = file_get_contents($_FILES['upload']['tmp_name']);
				$txt = iconv("TIS-620", "UTF-8", $txt);
				file_put_contents("input/".hash_hmac('sha256', $_POST['name'], ENCRYPTION_KEY).".csv", $txt);
				$found['uploaded'] = 1;
				write_data($data);
				print '<meta http-equiv="refresh" content="0;url=backend.php?step=1&file='.$item['id'].'">';
				die();
			}else{
				$themeData['error'] = "ไม่พบไฟล์ที่เลือกไว้";
			}
		}
	}else if(isset($_GET['step'])){
		$found = false;
		foreach($data as &$item){
			if($item['id'] == $_GET['file']){
				$found = &$item;
				break;
			}
		}
		if(!$found){
			print "ไม่พบไฟล์ที่เลือกไว้";
		}else{
			$filename = "input/".hash_hmac('sha256', $_GET['file'], ENCRYPTION_KEY).".csv";
			if(in_array($_GET['step'], array("1", "2", "3"))){
				require_once "scoreprocessor.php";

				$sp = new ScoreProcessor($filename, "data/".$_GET['file']."/", $_GET['file'], $found['name']);
				$sp->{"step".$_GET['step']}();

				$step = $_GET['step'] + 1;
				$found['uploaded'] = $step;
				write_data($data);
				print '<meta http-equiv="refresh" content="2;url=backend.php?step='.$step.'&file='.$item['id'].'">';
			}else if($_GET['step'] == "4"){
				unlink($filename);
				print '<meta http-equiv="refresh" content="0;url=backend.php">';
			}
		}
		die();
	}

	$themeData['items'] = $data;

	require_once "templates/list.php";
	list_theme($themeData);

}else{
	page_login();
}
