<?php
/*
Plugin Name: Custom wordpress block
Plugin URI: https://yourpluginurl.com/
Description: Example plugin for DMG Media - providing custom blocks for Gutenberg.
Version: 1.0.0
Author: Jonathan Warde
License: GPL-2.0+
License URI: http://www.gnu.org/licenses/gpl-2.0.txt
Text Domain: custom-blocks
*/
function custom_blocks_enqueue() {
    wp_enqueue_script(
        'custom-blocks',
        plugins_url( 'build/index.js', __FILE__ ),
        array( 'wp-blocks', 'wp-element', 'wp-editor' ),
        filemtime( plugin_dir_path( __FILE__ ) . 'build/index.js' ),
        true
    );
}
add_action( 'enqueue_block_editor_assets', 'custom_blocks_enqueue' );
