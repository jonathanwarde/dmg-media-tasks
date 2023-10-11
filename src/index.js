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

import { Button, TextControl, SelectControl } from '@wordpress/components';
import { useState } from '@wordpress/element';
import apiFetch from '@wordpress/api-fetch';

const { registerBlockType } = wp.blocks;

registerBlockType('custom-blocks/add-post-button', {
    title: 'Add Post Button',
    icon: 'admin-post',
    category: 'layout',
    edit: function(props) {
        const [isSearching, setIsSearching] = useState(false);
        const [searchQuery, setSearchQuery] = useState('');
        const [searchResults, setSearchResults] = useState([]);

        const handleSearch = async () => {
            const results = await apiFetch({ path: `/wp/v2/posts?search=${searchQuery}` });
            setSearchResults(results);
        };

        return (
            <div>
                {isSearching ? (
                    <div>
                        <TextControl
                            label="Search Posts"
                            value={searchQuery}
                            onChange={(value) => {
                                setSearchQuery(value);
                                handleSearch();
                            }}
                        />
                        <SelectControl
                            label="Select a post"
                            options={[
                                { value: '', label: 'Select a REcent post...' },
                                ...searchResults.map((post) => ({
                                    value: post.id,
                                    label: post.title.rendered,
                                })),
                            ]}
                            onChange={(selectedPostId) => {
                                console.log(selectedPostId);
                            }}
                        />
                    </div>
                ) : (
                    <Button isPrimary onClick={() => setIsSearching(true)}>
                        Add a recent post
                    </Button>
                )}
            </div>
        );
    },
    save: function() {
        return null;
    },
});
