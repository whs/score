<?php
require_once "base.php";
$theme = array();

function base_cb(){
	global $theme;
?>
<div class="container">
	<div class="row">
		<div class="col-md-4 col-md-offset-4 col-sm-6 col-sm-offset-3">
			<h1>เข้าสู่ระบบ</h1>
			<form action="backend.php" method="POST" class="form">
				<div class="form-group">
					<label for="password">รหัสผ่าน:</label>
					<input id="password" type="password" name="password" class="form-control" autofocus>
					<div class="help-block">
						ใส่ได้อีก <?php print $theme['left']; ?> ครั้ง
					</div>
				</form>
				<input type="submit" value="Submit" class="btn btn-primary">
			</form>
		</div>
	</div>
</div>
<?php
}

function login_theme($left){
	global $theme;
	$theme['left'] = $left;

	base_theme();
}
