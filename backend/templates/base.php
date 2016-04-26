<?php
function base_theme(){
	global $props;
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>Backend</title>
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<?php if($props['useCdn']): ?>
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap.min.css" charset="utf-8">
	<link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/twitter-bootstrap/3.3.6/css/bootstrap-theme.css" charset="utf-8">
	<?php endif; ?>
	<link rel="stylesheet" href="css/backend.css" charset="utf-8">
</head>
<body>
	<?php base_cb(); ?>
</body>
</html>
<?php
}
