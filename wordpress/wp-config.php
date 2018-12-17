<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the
 * installation. You don't have to use the web site, you can
 * copy this file to "wp-config.php" and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * MySQL settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://codex.wordpress.org/Editing_wp-config.php
 *
 * @package WordPress
 */

// ** MySQL settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define('DB_NAME', 'wordpress5');

/** MySQL database username */
define('DB_USER', 'JulieFred');

/** MySQL database password */
define('DB_PASSWORD', '8p34TVyHtVLXMVfc');

/** MySQL hostname */
define('DB_HOST', 'localhost');

/** Database Charset to use in creating database tables. */
define('DB_CHARSET', 'utf8mb4');

/** The Database Collate type. Don't change this if in doubt. */
define('DB_COLLATE', 'utf8_general_ci');

/**#@+
 * Authentication Unique Keys and Salts.
 *
 * Change these to different unique phrases!
 * You can generate these using the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}
 * You can change these at any point in time to invalidate all existing cookies. This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define('AUTH_KEY',         'li<qmq>$:%3mAT>Zb~~R!a}+=9+AVX]Pw^~DnamXLy K}dA.@I!)4D4.zBOg$fA1');
define('SECURE_AUTH_KEY',  '#]PQZ/7b<YsMi;@6QN~_orUtdxo5TP|@*TyevW5C@CR}3{<`TI6Suc7<[VF_VI R');
define('LOGGED_IN_KEY',    '&V&y:k3tMr<}%^:zc{is~uD&xE*:9vRk]?lSQ0 )x.s@n:z$AA>m-8F~jxlKNHXa');
define('NONCE_KEY',        '6].=J?URDslPS-Uh0>4WSc}?YR.hTtj&S=U1OKp>1}3|L$_^+V.eD3FC4_/2qSj$');
define('AUTH_SALT',        'udj<wdQ|N jJz)]L,20mh/lp y9T?=e %w88tGm5A4~6Fg/@++Q[v2_1yu*6+k|%');
define('SECURE_AUTH_SALT', 'hXvIXoN?K-WZ[4WS~>@w(y%FxetM%U3?0R5x3ywQ@ZFeTU=4wmr/k+dC0X(tY$o6');
define('LOGGED_IN_SALT',   '9W)=FJ#tjpptnVExbXq9T}?K=4m#39v]J0luza|mB<OA,R*[3|_p2|-=&WM3WFN,');
define('NONCE_SALT',       '_h.*kgi52!wd$X[su$C6Y*otCk<TyA5O2g0Uh1)6_.,|4vB[!=.,(k,d&lb57.S[');

/**#@-*/

/**
 * WordPress Database Table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix  = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the Codex.
 *
 * @link https://codex.wordpress.org/Debugging_in_WordPress
 */
define('WP_DEBUG', false);

/* That's all, stop editing! Happy blogging. */

/** Absolute path to the WordPress directory. */
if ( !defined('ABSPATH') )
	define('ABSPATH', dirname(__FILE__) . '/');

/** Sets up WordPress vars and included files. */
require_once(ABSPATH . 'wp-settings.php');
