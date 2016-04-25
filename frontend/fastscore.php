<?php
error_reporting(0);
if(!empty($_POST['u']) && !empty($_POST['p']) && !empty($_POST['f'])){
	//"u".$l[0]."_".substr(sha1($l[0].$l[1].$this->id), 0, 5).".json"
	header("Location: fastscore.php?f=".$_POST['f']."/u".$_POST['u']."_".substr(sha1($_POST['u'].$_POST['p'].$_POST['f']), 0, 5));
	die();
}
if(isset($_GET['f'])){
	$error = "";
	if(preg_match('~^[0-9a-f]+/u[a-z0-9]+_[a-f0-9]{5}$~i', $_GET['f'])){
		if(is_readable("data/".$_GET['f'].".json")){
			$score = json_decode(file_get_contents("data/".$_GET['f'].".json"), true);
			$error = "ผลคะแนนของ ".htmlspecialchars($score['_name'])."<br>".htmlspecialchars($score['_fname'])."<table border='1'><tr><th>วิชา</th><th>คะแนน</th><th>%</th><th>ลำดับที่</th></tr>";
			foreach($score as $key=>$value){
				if($key[0] == "_"){
					continue;
				}
				$error .= "<tr><td>".htmlspecialchars($key)."</td>";
				if(isset($value['percent'])){
					$error .= "<td>".htmlspecialchars($value['score'])."</td><td>".number_format($value['percent'], 2)."%</td><td>".$value['rank']."</td>";
				}else{
					$error .= "<td colspan='3'>".htmlspecialchars($value['score'])."</td>";
				}
				$error .= "</tr>";
			}
			$error .= "</table>";
		}else{
			$error = "Error: ไม่พบข้อมูล";
		}
	}else{
		$error="Error: ข้อมูลผิดรูปแบบ";
	}
}
$files = json_decode(file_get_contents("data/files.json"), true);
?>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">
<html>
<head>
	<meta http-equiv='Content-Type' content='text/html; charset=utf-8'>
	<title>ระบบประกาศผลคะแนนสอบ</title>
</head>
<body>
	<h1>ระบบประกาศผลคะแนนสอบ</h1>
	<h2>โรงเรียนบดินทรเดชา (สิงห์ สิงหเสนี) ๒</h2>
	<?php
	if($error){
		print "<p>".$error."</p>";
	}
	?>
	<form action="fastscore.php" method="post">
		<label>
			เลขประจำตัว<br>
			<input type="text" name="u">
		</label><br>
		<label>
			รหัสผ่าน<br>
			<input type="password" name="p">
		</label><br>
		<label>
			รายการ<br>
			<select name="f">
				<?php
				foreach($files as $f){
					if(!isset($f['uploaded']) || $f['uploaded'] != 4){
						continue;
					}
					print '<option value="'.htmlspecialchars($f['id']).'">'.htmlspecialchars($f['name'])."</option>\n";
				}
				?>
			</select><br>
		</label>
		<input type="submit" value="ตรวจ">
	</form>
	<hr>
	งานทะเบียนวัดผล &amp; งานสื่อนวัตกรรมและเทคโนโลยี | <a href="http://www.whs.in.th">whs.in.th</a><br>
	<a href="desktop.html">Desktop version</a>
</body>
</html>