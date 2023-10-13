/**
 * TODO:
 * Write a Gutenberg block using native WP React tools (no ACF or other plugin dependencies). This block should allow
 *   editors to search for and then choose a published post to insert into the editor as a stylized anchor link.
 *   Editors should be able to search posts in the InspectorControls using a search string. Recent posts should be shown to
 *   choose from by default.
 *   The anchor text should be the post title and the anchor href should be the post permalink. The anchor should be output
 *   within a core/paragraph block with a HTML CSS class of `dmg-read-more` added to it. The anchor should be prepended
 *   with the words `Read More: `.
 *   Choosing a new post should update the anchor link shown in the editor.
 * 
 */

 import { useState } from '@wordpress/element';
 import { Button, TextControl, PanelBody, PanelRow } from '@wordpress/components';
 import { useSelect } from '@wordpress/data';
 import { InspectorControls } from '@wordpress/block-editor';
 import { registerBlockType } from '@wordpress/blocks';
 
 registerBlockType('custom-blocks/add-post-button', {
     title: 'Add Post Link',
     icon: 'admin-post',
     category: 'layout',
 
     edit: ({ setAttributes, attributes }) => {
         const [searchTerm, setSearchTerm] = useState('');
         const [selectedPost, setSelectedPost] = useState(null);
 
         const posts = useSelect((select) => {
             if (!searchTerm) return [];
             return select('core').getEntityRecords('postType', 'post', { search: searchTerm, per_page: 10 });
         }, [searchTerm]);
 
         const insertSelectedPost = () => {
             if (selectedPost) {
                 setAttributes({ postLink: selectedPost.link, postTitle: selectedPost.title.rendered });
             }
         };
 
         return (
             <>
                 <InspectorControls>
                     <PanelBody title="Search for a Post">
                         <PanelRow>
                             <TextControl
                                 type="search"
                                 value={searchTerm}
                                 onChange={value => setSearchTerm(value)}
                                 placeholder="Search..."
                             />
                         </PanelRow>
                         <PanelRow>
                             {posts && posts.map(post => (
                                 <Button isSecondary onClick={() => setSelectedPost(post)}>
                                     {post.title.rendered}
                                 </Button>
                             ))}
                         </PanelRow>
                         <PanelRow>
                             <Button isPrimary onClick={insertSelectedPost}>Insert Selected Post</Button>
                         </PanelRow>
                     </PanelBody>
                 </InspectorControls>
                 {attributes.postLink && <a href={attributes.postLink} className="dmg-read-more">Read More: {attributes.postTitle}</a>}
             </>
         );
     },
 
     save: ({ attributes }) => {
         if (attributes.postLink) {
             return <a href={attributes.postLink} className="dmg-read-more">Read More: {attributes.postTitle}</a>;
         }
         return null;
     },
 
     attributes: {
         postLink: {
             type: 'string',
         },
         postTitle: {
             type: 'string',
         },
     },
 });