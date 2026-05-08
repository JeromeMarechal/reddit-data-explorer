import React from 'react';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import {  fetchRedditPosts} from '../posts/postsSlice.js';
import styles from './SearchBar.module.css';

export const SearchBar = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const dispatch = useDispatch();

    const handleSearch = (e) => {
        e.preventDefault();
        
        if (searchTerm.trim() === '') {
            return;
        }

        dispatch(fetchRedditPosts({ type: 'search', query: searchTerm }));
    };

    return (
        <form className={styles.form} onSubmit={handleSearch}>
            <input
                className={styles.input}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder='Search On Reddit...'
            />
            <button className={styles.button} type="submit">
                Search  
            </button>
        </form>
    );
};

export default SearchBar;