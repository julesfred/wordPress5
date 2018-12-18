<?php
/*
 * Block Name: Hero
 * 
 */

$heroImage = get_field("field_5c1923a3acc36");
$heroHeadline = get_field("field_5c1923b6acc37");
?>

<div style="position: relative; height: 300px; width: 100%;">
	<h2 style="position: absolute; bottom: 50%; right: 50%; transform: translate(50%, 50%); color: #fff; z-index: 2;"><?php echo $heroHeadline; ?></h2>
	<div style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('<?php echo $heroImage; ?>'); z-index: 1;background-size: cover; background-position: center; background-repeat: no-repeat;"> </div>
</div>