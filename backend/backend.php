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
		file_put_contents("data/".$fileID."/index.html", "<script>window.location='../../'</script>");
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
			print "ยังไม่ได้เลือกไฟล์";
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
				print "<script>window.location='backend.php?step=1&file=".$item['id']."';</script>";
				die();
			}else{
				print "ไม่พบไฟล์ที่เลือกไว้";
			}
		}
	}else if(isset($_GET['step'])){
		require_once "scoreprocessor.php";
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
			$filename = "input/".hash_hmac('sha256', $_GET['file'], $encryptionKey).".csv";
			$sp = new ScoreProcessor($filename, "data/".$_GET['file']."/", $_GET['file'], $found['name']);
			if(in_array($_GET['step'], array("1", "2", "3"))){
				$sp->{"step".$_GET['step']}();
				$step = $_GET['step'] + 1;
				$found['uploaded'] = $step;
				write_data($data);
				print "<script>setTimeout(function(){ window.location='backend.php?step=".$step."&file=".$item['id']."'; }, 1500);</script>";
				die();
			}else if($_GET['step'] == "4"){
				unlink($filename);
				print "<script>window.location='backend.php'</script>";
			}
		}
	}

	$themeData['items'] = $data;

	require_once "templates/list.php";
	list_theme($themeData);

}else{
	page_login();
}
