<?php

/**
 * The public-facing functionality of the plugin.
 *
 * @link       http://example.com
 * @since      1.0.0
 *
 * @package    WP_Kecil
 * @subpackage WP_Kecil/public
 */

//define('WP_KECIL_API_URL', 		'http://kecil.magloft.com/kecilify');
define('WP_KECIL_API_URL', 		'http://localhost:3000/kecilify');
define('WP_KECIL_UPLOADS_DIR', 	'wp-content/uploads/kecil');
define('WP_KECIL_CACHING', 		false);

/**
 * The public-facing functionality of the plugin.
 *
 * Defines the plugin name, version, and two examples hooks for how to
 * enqueue the admin-specific JavaScript.
 *
 * @package    WP_Kecil
 * @subpackage WP_Kecil/public
 * @author     Dan Borufka <dan@dropz.io>
 */
class WP_Kecil_Public {

	private $plugin_name;
	private $version;

	public $html;
	public $response;

	public $images;
	public $request_images;
	public $returned_images;

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    1.0.0
	 * @param    string    $plugin_name  The name of the plugin.
	 * @param    string    $version    	 The version of this plugin.
	 */
	public function __construct( $plugin_name, $version=1 ) {

		$this->plugin_name = $plugin_name;
		$this->version = $version;

		$this->images = [];
		$this->response = [];
		$this->init();
	}

	public function init() {
		$this->request_images  = [];
		$this->returned_images = [];
		$this->html = '';

		return $this;
	}

	public function extract_images($html) {

		$this->html = $html;

		$result = [];
		preg_match_all('/<img[^>]+>/i', $html, $result); 
		$images = $result[0];

		foreach ($images as $i => $image) {

			// find attributes
			preg_match_all('/ ([^=]+)="([^"]*)"/i', $image, $attrs);
			$attrs = array_combine($attrs[1], $attrs[2]);
			$md5 = md5($attrs['src']);

			$images[$md5] = $attrs;
			$images[$md5]['element'] = $image;

			// check for cached file and get its contents if existent
			if(file_exists($md5_file = WP_KECIL_UPLOADS_DIR . "/$md5.svg") && WP_KECIL_CACHING) {
				$images[$md5]['svg'] = addslashes(file_get_contents( $md5_file ));
			} else {
				$this->request_images []= $attrs['src'];
			}
			unset($images[$i]);
		}

		$this->images = $images;

		return $this;
	}

	public function get_cached_requests() {
		foreach( $this->images as $md5 => $image ) {
			if(isset($image['svg'])) {
				$this->returned_images[] = [$md5 => $image['svg'], 'width' => $image['width'], 'height' => $image['height']];
				unset( $this->images[$md5]['svg'] );
			}
		}
		return $this;
	}

	public function request() {

		if(count($this->request_images)) {

			$request = json_encode(['images' => $this->request_images]);

			$params = ['http' => [ 'method' => 'POST',
					               'header' => "Content-type: application/json\r\n",
					               'content' => $request ]
         	];

         	$response = @file_get_contents(WP_KECIL_API_URL, false, stream_context_create($params));
			$response = @json_decode($response);

			// echo '<h1>REQUEST:</h1>';
   //       	echo '<pre>';
   //       	var_dump( $request );
   //       	echo '</pre>';
   //       	echo '<h1>RESPONSE:</h1>';
   //       	echo '<pre>';
   //       	var_dump( $response );

			if(!isset($response->images)) {
				$response = false;
			}
			$this->response = $response->images;
		}
		return $this;
	}

	public function handle_response() {

		if( $this->response ) {
			$this->returned_images = array_merge( $this->returned_images, $this->response );
		}

		foreach ($this->returned_images as $returned_image) {

			$returned_image = is_array($returned_image) ? $returned_image : get_object_vars($returned_image);
			$md5 			= $returned_image['key'];
			$data 			= 'data:image/svg+xml;base64,' . base64_encode($returned_image['svg']);
			$image 			= $this->images[$md5];
			$attrs 			= '';

			if(!$image) continue;

			if(!isset($image['width'])) {
				if(isset($returned_image['width'])) {
					$image['width'] = $returned_image['width'];
				}
			}

			if(!isset($image['height'])) {
				if(isset($returned_image['height'])) {
					$image['height'] = $returned_image['height'];
				}
			}

			$image['data'] = $data;

			foreach($image as $prop => $val) {
				if(!in_array($prop, ['src', 'element'])) {
					$attrs .= "$prop='$val' ";
				}
			}

			$this->images[$md5]['src'] 	 = $image['element'];
			$this->images[$md5]['element'] = "<object type=\"image/svg+xml\" $attrs></object>";

			$image_out = $this->images[$md5];

			// save cache file
			if(!file_exists($md5_file = WP_KECIL_UPLOADS_DIR . "/$md5.svg")) {
				if(WP_KECIL_CACHING) {
					file_put_contents($md5_file, $data);
				}
			}

			$this->html = str_replace($image_out['src'], $image_out['element'], $this->html);
		}
		return $this->html;
	}


	public function run($html) {

		/** create own folder inside uploads for cached images **/
		wp_mkdir_p( WP_KECIL_UPLOADS_DIR );

		return $this
				->init()
				->extract_images( $html )
				->request()
				->get_cached_requests()
			 	->handle_response();
	}

	/**
	 * Register the JavaScript for the public-facing side of the site.
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

		//wp_enqueue_script( $this->plugin_name, plugin_dir_url( __FILE__ ) . 'js/wp-kecil-public.js', array( 'jquery' ), $this->version, false );

	}

}
