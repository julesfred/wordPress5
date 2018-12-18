<?php
/*
 * Template Name: Homepage
 */

get_header();
?>
	<?php if ( have_posts() ) while ( have_posts() ) : the_post(); ?>
		<div class="container">
			<h2>Homepage Wordpress 5</h2>
			<div>
				<?php the_content(); ?>
			</div>
		</div>
	<?php endwhile; ?>
<?php
get_footer();
