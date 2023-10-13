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

if ( defined( 'WP_CLI' ) && WP_CLI ) {

    class DMG_Read_More_Command extends WP_CLI_Command {

        /**
         *  Search for posts containing the Gutenberg block within a date range.
         *  wp dmg-read-more search --date-before="2021-12-31" --date-after="2021-01-01"
         */
        public function search( $args, $assoc_args ) {
            
            $date_before = isset( $assoc_args['date-before'] ) ? $assoc_args['date-before'] : date( 'Y-m-d', strtotime( '-30 days' ) );
            $date_after = isset( $assoc_args['date-after'] ) ? $assoc_args['date-after'] : date( 'Y-m-d' );

            $args = array(
                'post_type' => 'post',
                'posts_per_page' => -1, // TODO: perf consideration searching thousands of records
                'date_query' => array(
                    array(
                        'after' => $date_after,
                        'before' => $date_before,
                        'inclusive' => true,
                    ),
                ),
                's' => '<!-- wp:custom-blocks/add-post-button', 
            );

            $query = new WP_Query( $args );

            if ( $query->have_posts() ) {
                while ( $query->have_posts() ) {
                    $query->the_post();
                    WP_CLI::log( get_the_ID() );
                }
                wp_reset_postdata();
            } else {
                WP_CLI::log( 'No posts found.' );
            }
        }
    }

    WP_CLI::add_command( 'dmg-read-more', 'DMG_Read_More_Command' );

}

