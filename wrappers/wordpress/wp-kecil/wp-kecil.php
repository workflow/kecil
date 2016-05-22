<?php

/**
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              http://github.com/workflow/kecil
 * @since             1.0.0
 * @package           WP_Kecil
 *
 * @wordpress-plugin
 * Plugin Name:       Kecil: Image Lazy Loader with Blurred Previews
 * Plugin URI:        http://github.com/workflow/kecil/
 * Description:       Kecil is an implementation that allows you to achieve the "blurry image loading effect" (as seen on Medium) with very little effort.
 * Version:           1.0.0
 * Author:            Dropz & Magloft
 * Author URI:        http://bit.ly/1qCL5Nn
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       wp-kecil
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-wp-kecil-activator.php
 */
function activate_plugin_name() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-wp-kecil-activator.php';
	Plugin_Name_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-wp-kecil-deactivator.php
 */
function deactivate_plugin_name() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-wp-kecil-deactivator.php';
	Plugin_Name_Deactivator::deactivate();
}

register_activation_hook( 	__FILE__, 'activate_plugin_name' 	);
register_deactivation_hook( __FILE__, 'deactivate_plugin_name'  );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-wp-kecil.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */

$Kecil = new WP_Kecil();
$Kecil->run();
