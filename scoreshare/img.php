<?php
class IOException extends Exception{}

if($_GET['server'] == "local"){
	$server = "http://bd2.in.th/score/";
}else{
	$server = "http://www.bodin2.ac.th/test/";
}

$datafile = $server."/data/".$_GET['folder']."/".$_GET['file'].".json";
@$data = file_get_contents($datafile);
if(!$data){
	throw new IOException("Cannot load data from remote server");
}
$data = json_decode($data, true);
if($data === null && json_last_error() != JSON_ERROR_NONE){
	throw new Exception("JSON Error ".json_last_error_msg());
}
@$statfile = file_get_contents($server.'/data/'.$_GET['folder'].'/stats.json');
$stat = json_decode($statfile, true);

$size = 80; // header

$img = new Imagick();

$font = array(
	'sb' => 'ThaiSansNeue-SemiBold.otf',
	'r' => 'ThaiSansNeue-Regular.otf',
	'b' => 'ThaiSansNeue-Bold.otf',
);

$curY = 0;

$draw = new ImagickDraw();
$draw->setFont($font['b']);
$draw->setGravity(Imagick::GRAVITY_NORTHWEST);

// draw name
$draw->setFontSize(36);
$draw->annotation(10, $curY, $data['_name']);
$metrics = $img->queryFontMetrics($draw, $data['_name']);
$curY += $metrics['characterHeight'];

// draw file name
$draw->setFontSize(28);
$draw->setFont($font['r']);
$draw->setFillColor('#888');
$draw->annotation(10, $curY, $data['_fname']);
$curY = 80;

// draw each subjects
$barHeight = 58;
foreach($data as $subj => $val){
	if($subj[0] == "_"){
		continue;
	}
	if(isset($val['percent'])){
		if($val['percent'] < 10){
			$draw->setFillColor('#5c0009');
			$tc = '#eeeeee';
		}else if($val['percent'] < 20){
			$draw->setFillColor('#a10010');
			$tc = '#eeeeee';
		}else if($val['percent'] < 30){
			$draw->setFillColor('#c80014');
			$tc = '#eeeeee';
		}else if($val['percent'] < 40){
			$draw->setFillColor('#c8314e');
			$tc = '#eeeeee';
		}else if($val['percent'] < 50){
			$draw->setFillColor('#ff7a0c');
			$tc = 'black';
		}else if($val['percent'] < 60){
			$draw->setFillColor('#ffdf3e');
			$tc = 'black';
		}else if($val['percent'] < 70){
			$draw->setFillColor('#afff3a');
			$tc = 'black';
		}else if($val['percent'] < 80){
			$draw->setFillColor('#67c62d');
			$tc = '#eeeeee';
		}else if($val['percent'] < 90){
			$draw->setFillColor('#2dc62a');
			$tc = '#eeeeee';
		}else{
			$draw->setFillColor('#186e17');
			$tc = '#eeeeee';
		}
		$width = 350 * $val['percent'] / 100;
		$text = $subj.': '.$val['score'].' ('.number_format($val['percent'], 2).'%)';
	}else{
		$draw->setFillColor('cornflowerblue');
		$tc = 'white';
		$width = 350;
		$text = $subj.': '.$val['score'];
	}
	$draw->rectangle(0, $curY, $width, $curY + $barHeight);
	$draw->setFontSize(28);
	$draw->setFont($font['sb']);
	$textSize = $img->queryFontMetrics($draw, $text);
	$textSize = $textSize['characterHeight'];
	// draw average
	if(isset($stat[$subj])){
		// scorebox
		$avgWidth = ($stat[$subj]['average']/$stat[$subj]['max']) * 350;
		$draw->setFillColor('#ff8c0050');
		$draw->rectangle($avgWidth, $curY, $avgWidth+1, $curY + $barHeight);
		$draw->setFillColor('#ff87e550');
		$maxWidth = ($stat[$subj]['hiscore']/$stat[$subj]['max']) * 350;
		if($maxWidth > 350-1){
			$maxWidth = 350-1;
		}
		$draw->rectangle($maxWidth, $curY, $maxWidth+1, $curY + $barHeight);

		$draw->setFontSize(22);
		$draw->setFont($font['b']);
		$draw->setFillColor($tc);
		$stattext = 'เฉลี่ย '.number_format($stat[$subj]['average'], 2).' สูงสุด '.$stat[$subj]['hiscore'];
		if($tc == '#eeeeee'){
			$draw->setFillColor('black');
			$draw->annotation(10, $curY + $textSize + 1.5, $stattext);
		}
		$draw->setFillColor($tc);
		$draw->annotation(10, $curY + $textSize, $stattext);
	}
	$draw->setFontSize(28);
	$draw->setFont($font['sb']);
	if($tc == '#eeeeee'){
		$draw->setFillColor('black');
		$draw->annotation(10, $curY+1.5, $text);
	}
	$draw->setFillColor($tc);
	$draw->annotation(10, $curY, $text);
	$curY += $barHeight;
	$size += $barHeight;
}

// footer
$size += 30;
$draw->setFontSize(18);
$draw->setFont($font['r']);
$draw->setFillColor('#1782ff');
$draw->annotation(5, $curY+5, 'โรงเรียนบดินทรเดชา (สิงห์ สิงหเสนี) ๒');

$img->newImage(350, $size, 'white', 'png'); // png8 is better? check aliasing?
$img->drawImage($draw);
header('Content-Type: image/png');
echo $img;
