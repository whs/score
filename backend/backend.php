<?php
ob_start();
require "auth.php";
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="UTF-8">
	<title>Backend | ระบบผลคะแนนสอบ</title>
	<style>
input, input[type=submit]{
	font-size: 14pt;
}
	</style>
</head>
<body>
<?php
if(check_login()){
	$data = parse_data();

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
				file_put_contents("input/".$_POST['name'].".csv", $txt);
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
			$filename = "input/".$_GET['file'].".csv";
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


?>
<h1>Backend</h1>
<?php
if(!is_writable("data") || !is_writable("data/files.json") || !is_writable("input")){
	print "<div style='color:red;'>Error: Data is not writable.</div>";
}
if($encryptionKey === "default"){
	print "<div style='color:yellow;'>Warning: Encryption key set to to default</div>";
}
?>
<form action="backend.php" method="POST">
	<input type="text" name="new" size="100"><input type="submit" value="เพิ่มไฟล์">
</form>
<form action="backend.php" method="POST" enctype="multipart/form-data">
<table border="1">
	<tr><th>Name</th><th>Upload</th><th>Delete</th></tr>
<?php
if(count($data) > 0){
foreach($data as $item):
?>
	<tr><td><?php print htmlspecialchars($item['name']); ?></td>
		<td><?php if(!isset($item['uploaded'])){ ?>
		<input type="radio" name="name" value="<?php print $item['id'] ?>">
		<?php }else if($item['uploaded'] < 4){
			print "<a href='backend.php?step={$item['uploaded']}&file={$item['id']}'>ประมวลผลต่อ</a>";
		}else{
			print "ประกาศผลแล้ว";
		} ?></td>
		<td><button type="submit" name="delete" value="<?php print $item['id'] ?>" onclick="return confirm('Delete?')">Delete</button></td></tr>
<?php
endforeach;
}
?>
</table>
Upload file: <input type="file" name="upload">
<input type="submit" value="Upload">
</form>
<?php
}
?>
</body>
</html>
