<?php
require_once "base.php";
$theme = array();

function base_cb(){
	global $theme;
?>
<div class="container">
	<div class="row">
		<div class="col-xs-12">
			<h1>Backend</h1>
			<?php if($theme['warn_unwritable']): ?>
			<div class="alert alert-danger">
				<strong>ไม่สามารถเขียนไฟล์เก็บข้อมูลได้</strong>
				<p>ตรวจสอบว่าโปรแกรมสามารถเขียนไฟล์ <code>data/files.json</code>
				โฟลเดอร์ <code>data</code> และ <code>input</code> ได้</p>
				<p>ศึกษาเพิ่มเติมจาก<a href="https://github.com/whs/score">เอกสารการติดตั้งโปรแกรม</a></p>
			</div>
			<?php endif; ?>
			<?php if($theme['warn_encryption_insecure']): ?>
			<div class="alert alert-warning">
				<strong>การเข้ารหัสไม่ปลอดภัย</strong>
				<p>การตั้งค่าโปรแกรมเสี่ยงต่อการถูกคาดเดาไฟล์ข้อมูล กรุณาเปลี่ยนค่า <code>ENCRYPTION_KEY</code> ในไฟล์ <code>config.php</code> ให้เป็นข้อความสุ่มที่คาดเดาได้ยาก</p>
				<p>ศึกษาเพิ่มเติมจาก<a href="https://github.com/whs/score">เอกสารการติดตั้งโปรแกรม</a></p>
			</div>
			<?php endif; ?>
		</div>
	</div>
</div>
<div class="container-fluid">
	<div class="row">
		<div class="col-md-8">
			<form action="backend.php" method="POST" enctype="multipart/form-data">
				<div class="table-responsive">
					<table class="table table-striped table-hover" id="datatable">
						<thead>
							<tr><th><th>ชื่อแสดงผล</th><th>สถานะ</th><th>ลบ</th></tr>
						</thead>
					<?php
					if(count($theme['items']) > 0):
					foreach($theme['items'] as $item):
					?>
						<tr>
							<td>
								<?php if(!isset($item['uploaded'])): ?>
								<input type="radio" name="name" value="<?php print $item['id'] ?>">
								<?php endif; ?>
							</td>
							<td><?php print htmlspecialchars($item['name']); ?></td>
							<td>
								<?php
								if($item['uploaded'] == 0):
								?>
								ยังไม่ประกาศผล
								<?php
								elseif($item['uploaded'] < 4):
									$url = "backend.php?step={$item['uploaded']}&amp;file={$item['id']}";
								?>
								<a href="<?php echo $url; ?>">ประมวลผลต่อ</a>
								<?php else: ?>
								<div class="text-success">ประกาศผลแล้ว</div>
								<?php endif; ?>
							</td>
							<td>
								<button type="submit" name="delete" value="<?php print $item['id'] ?>" onclick='return confirm(<?php echo json_encode("ลบ {$item['name']}?"); ?>)' class="btn btn-default btn-sm">&times;</button>
							</td>
						</tr>
					<?php
					endforeach;
					endif;
					?>
						<tr id="announceform" class="info">
							<td colspan="3">
								<input type="file" name="upload" class="form-control" accept="text/csv">
							</td>
							<td>
								<input type="submit" value="อัพโหลด" class="btn btn-primary">
							</td>
						</tr>
					</table>
				</div>
			</form>
		</div>
		<div class="col-md-4">
			<h4>เพิ่มไฟล์</h4>
			<form action="backend.php" method="POST">
				<div class="form-group">
					<label for="new">ชื่อแสดงผล</label>
					<input type="text" name="new" id="new" class="form-control">
					<div class="help-block">
						เช่น <mark>16 กุมภาพันธ์ 2559 - ม.ปลาย</mark>
					</div>
				</div>
				<input type="submit" value="เพิ่ม" class="btn btn-primary">
			</form>
		</div>
	</div>
</div>
<script>
(function(){
	var form = document.getElementById("announceform");
	form.style.display = "none";

	document.getElementById("datatable").addEventListener("change", function(e){
		var tableRow = e.target;
		while(tableRow.tagName != 'TR'){
			tableRow = tableRow.parentElement;
		}
		tableRow.parentElement.insertBefore(form, tableRow.nextSibling);
		form.style.display = "table-row";
	}, false);
})();
</script>
<?php
}

function list_theme($t){
	global $theme;
	$theme = $t;
	base_theme();
}
