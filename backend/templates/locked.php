<?php
require_once "base.php";

function base_cb(){
?>
<div class="container">
	<div class="row">
		<div class="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3">
			<h1>เข้าสู่ระบบ</h1>
			<div class="text-danger">
				ไม่อนุญาตให้ใช้งาน เนื่องจากคุณใส่รหัสผ่านผิดเกิน <?php echo TRIES; ?> ครั้ง
			</div>
		</div>
	</div>
</div>
<?php
}

function locked_theme(){
	base_theme();
}
