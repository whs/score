<?php
/**
 * Score processor
 * @author Manatsawin Hanmongkolchai, Bodin 2#18
 * @since 2 March 2013
 */
class ScoreProcessor{
	public function __construct($file, $outdir, $id, $name){
		$this->filename = $file;
		$this->file = fopen($file, "r");
		$this->outdir = $outdir;
		$this->id = $id;
		$this->name = $name;
	}
	public function step1(){
		print "<pre>รวบรวมรายวิชา และเก็บข้อมูลคะแนน...\n";
		flush();
		$histogram = array();
		$hasFloat = false;
		$line = 1;
		while($l = fgetcsv($this->file)){
			$lastSubject = "";
			foreach($l as $ind => $v){
				if($ind < 3 || (empty($v) && $v !== '0')){
					continue;
				}
				$v = trim($v);
				if($ind % 2 == 1){
					if(!preg_match('~\([0-9]+\)$~', $v)){
						$lastSubject = "";
						continue;
					}
					if(!array_key_exists($v, $histogram)){
						$histogram[$v] = array();
						print "$line: พบวิชา ".htmlspecialchars($v)."\n";
						flush();
					}
					$lastSubject = $v;
				}else if($lastSubject != ""){
					// score
					if(floatval($v) != intval($v)){
						$hasFloat = true;
					}
					$v = (string) round(floatval($v));
					$a = &$histogram[$lastSubject];
					if(!array_key_exists($v, $a)){
						$a[$v] = 0;
					}
					$a[$v]++;
				}
			}
			$line++;
		}
		print "\nสรุปฮิสโตรแกรม...\n";
		foreach($histogram as $subj => &$his){
			preg_match('~\(([0-9]+)\)$~', $subj, $match);
			$maxscore = (int) $match[1];
			$out = array();
			$sum = 0;
			for($i=0; $i<=$maxscore; $i++){
				$out[] = (int) $his[$i];
				$sum += $his[$i];
			}
			$his = array(
				"histogram" => $out,
				"max" => $maxscore,
				"name" => $subj,
				"count" => $sum,
			);
			print htmlspecialchars($subj).": ผู้สอบ $sum คน\n";
		}
		$histogram["_float"] = $hasFloat;
		print "\nบันทึกข้อมูล...";
		file_put_contents($this->outdir."stats.json", json_encode($histogram));
		print "\n\nโปรแกรมกำลังประมวลผลขั้นต่อไป...</pre>";
	}
	public function step2(){
		// load the histogram input file
		@$histogram = file_get_contents($this->outdir."stats.json");
		if(empty($histogram)){
			print "Error: ไม่พบข้อมูลฮิสโตรแกรมจากขั้นตอนแรก โปรแกรมไม่สามารถทำงานต่อได้";
			die();
		}
		$histogram = json_decode($histogram, true);
		print "<pre>โหลดข้อมูลฮิสโตรแกรมของ ".count($histogram)." รายวิชา\n";
		foreach($histogram as $subj => &$data){

			if($subj[0] == "_" && is_bool($data)){
				continue;
			}

			// Find hiscore
			$d = array_reverse($data['histogram']);
			foreach($d as $ind=>$ppl){
				if($ppl > 0){
					break;
				}
			}
			$data['hiscore'] = $data['max'] - $ind;
			$data['hiscore_cnt'] = $ppl;
			print htmlspecialchars($subj).": คะแนนสูงสุด {$data['hiscore']} - {$data['hiscore_cnt']} คน\n";
			flush();
			// Find lowscore & lowscore2
			$ls1ind = -1;
			$ls2ind = -1;
			foreach($data['histogram'] as $ind=>$ppl){
				if($ppl > 0){
					if($ls1ind == -1){
						$ls1ind = $ind;
					}else{
						$ls2ind = $ind;
						break;
					}
				}
			}
			$data['lowscore'] = $ls1ind;
			$data['lowscore_cnt'] = $data['histogram'][$ls1ind];
			$data['lowscore2'] = $ls2ind;
			$data['lowscore2_cnt'] = $data['histogram'][$ls2ind];
			print htmlspecialchars($subj).": คะแนนต่ำสุด {$data['lowscore']} - {$data['lowscore_cnt']} คน\n";
			print htmlspecialchars($subj).": คะแนนต่ำสุดอันดับ 2 {$data['lowscore2']} - {$data['lowscore2_cnt']} คน\n";
			flush();
			// Find mode
			$data['mode_cnt'] = max($data['histogram']);
			$data['mode'] = array_search($data['mode_cnt'], $data['histogram']);
			print htmlspecialchars($subj).": ฐานนิยม {$data['mode']} - {$data['mode_cnt']} คน\n";
			// Find average & x^2
			$sum = 0;
			$sumX2 = 0;
			foreach($data['histogram'] as $ind=>$cnt){
				$sum += $ind*$cnt;
				$sumX2 += pow($ind,2)*$cnt;
			}
			$data['average'] = $sum/$data['count'];
			$data['sd'] = ($sumX2-($data['count']*pow($data['average'], 2)))/$data['count'];
			print htmlspecialchars($subj).": ค่าเฉลี่ย {$data['average']} (Sum Xi = $sum)\n";
			print htmlspecialchars($subj).": SD {$data['sd']} (Sum Xi^2 = $sumX2)\n";
			print "\n";
		}
		print "\nบันทึกข้อมูล...";
		file_put_contents($this->outdir."stats.json", json_encode($histogram));
		print "\n\nโปรแกรมกำลังประมวลผลขั้นต่อไป...</pre>";
		print "</pre>";
	}
	public function step3(){
		@$histogram = file_get_contents($this->outdir."stats.json");
		if(empty($histogram)){
			print "Error: ไม่พบข้อมูลฮิสโตรแกรมจากขั้นตอนแรก โปรแกรมไม่สามารถทำงานต่อได้";
			die();
		}
		$histogram = json_decode($histogram, true);
		print "<pre>โหลดข้อมูลฮิสโตรแกรมของ ".count($histogram)." รายวิชา\n";
		$cnt=0;

		// ranking again (for floating point that does not fit in histogram)
		if($histogram['_float']){
			$scores = $this->getSubjectScores();
			foreach($scores as &$subjectScore){
				rsort($subjectScore, SORT_NUMERIC);
			}
			rewind($this->file);
		}

		while($l = fgetcsv($this->file)){
			// sha1(id + password + fileid)
			$password = substr(sha1($l[0].sprintf("%04s", $l[1]).$this->id), 0, 5);

			$file = "u".$l[0]."_".$password.".json";

			$out = array(
				'_name' => trim($l[2]),
				'_fname' => $this->name
			);

			$lastSubject = null;
			foreach($l as $ind => $v){
				if($ind<3 || (empty($v) && $v !== '0')){
					continue;
				}
				if($ind % 2 == 1){
					$lastSubject = $v;
				}else{
					$out[$lastSubject] = array(
						'score' => floatval($v),
					);
					if(preg_match('~\([0-9]+\)$~', $lastSubject)){
						$out[$lastSubject]['standard'] = ($v - $histogram[$lastSubject]['average'])/$histogram[$lastSubject]['sd'];
						if(isset($scores) && array_key_exists($lastSubject, $scores)){
							$out[$lastSubject]['rank'] = array_search(floatval($v), $scores[$lastSubject]) + 1;
						}else{
							$out[$lastSubject]['rank'] = array_sum(array_slice($histogram[$lastSubject]['histogram'], round(floatval($v))+1))+1;
						}
						$out[$lastSubject]['percent'] = ($v/$histogram[$lastSubject]['max'])*100;
					}else{
						$out[$lastSubject]['score'] = $v;
					}
				}
			}
			file_put_contents($this->outdir.$file, json_encode($out));
			$cnt++;
			if($cnt % 50 == 0){
				print $cnt."...\n";
				flush();
			}
		}
		fclose($this->file);
		print "\nบันทึกข้อมูลเรียบร้อย พร้อมประกาศผล";
		print "</pre>";
	}

	private function getSubjectScores(){
		$out = array();
		while($line = fgetcsv($this->file)){
			$lastSubject = null;
			foreach(array_slice($line, 3) as $index => $value){
				if($index % 2 == 0){
					$lastSubject = $value;
				}else{
					$out[$lastSubject][] = $value;
				}
			}
		}
		return $out;
	}
}
