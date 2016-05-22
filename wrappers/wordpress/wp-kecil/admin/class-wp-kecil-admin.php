<?php

/**
 * The admin-specific functionality of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    WP_Kecil
 * @subpackage WP_Kecil/admin
 */

/**
 * The admin-specific functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific stylesheet and JavaScript.
 *
 * @package    WP_Kecil
 * @subpackage WP_Kecil/admin
 * @author     Your Name <email@example.com>
 */
class WP_Kecil_Admin {

	/**
	 * The ID of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $wp_kecil    The ID of this plugin.
	 */
	private $wp_kecil;

	/**
	 * The version of this plugin.
	 *
	 * @since    1.0.0
	 * @access   private
	 * @var      string    $version    The current version of this plugin.
	 */
	private $version;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param      string    $wp_kecil       The name of this plugin.
	 * @param      string    $version    The version of this plugin.
	 */
	public function __construct( $wp_kecil, $version ) {

		$this->plugin_name = $wp_kecil;
		$this->version = $version;

	}

	public function actions() {

		$success = false;

		if(isset($_GET['action'])) {
			switch ($_GET['action']) {
				case 'wp_kecil_empty_cache':

					check_admin_referer( 'wp_kecil_empty_cache' );

					foreach (glob(get_home_path() . '/' . WP_KECIL_UPLOADS_DIR . '/*.*') as $file) {
						unlink($file);
					}

					$success = 'All cached preview images from Kecil have been removed!';
					break;
			}
		}

		if($success) {
			?>
		    <div class="notice notice-success is-dismissible">
		        <p><?php _e( $success, 'wp-kecil' ); ?></p>
		    </div>
    	<?php
		}
	}

	public function action_links($links) {

		$mylinks = ['<a href="' . wp_nonce_url( admin_url( 'plugins.php?action=wp_kecil_empty_cache' ), 'wp_kecil_empty_cache') . '">Empty Out Cache</a>'];
		return array_merge( $links, $mylinks );

	}

	/**
	 * Register the stylesheets for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_styles() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in WP_Kecil_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The WP_Kecil_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_style( $this->wp_kecil, plugin_dir_url( __FILE__ ) . 'css/wp-kecil-admin.css', array(), $this->version, 'all' );

	}

	/**
	 * Register the JavaScript for the admin area.
	 *
	 * @since    1.0.0
	 */
	public function enqueue_scripts() {

		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in WP_Kecil_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The WP_Kecil_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		wp_enqueue_script( $this->wp_kecil, plugin_dir_url( __FILE__ ) . 'js/wp-kecil-admin.js', array( 'jquery' ), $this->version, false );

	}

}
