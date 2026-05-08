import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRedditPosts } from './postsSlice.js';
import styles from './CategoryFilter.module.css';


const categories = ['hot', 'new', 'top', 'rising'];

const CategoryFilter = ({ query, type }) => {
    const dispatch = useDispatch();
    const activeCategory = useSelector((state) => state.posts.actualParams.filter || 'hot');

    return (
        <nav className={styles.container}>
            {categories.map((category) => (
                <button
                    type="button"
                    className={`${styles.button} ${activeCategory === category ? styles.activeButton : ''}`}
                    key={category}
                    onClick={() => dispatch(fetchRedditPosts({ query, type, filter: category }))}
                >
                    {category}
                </button>
            ))}
        </nav>
    );
};

export default CategoryFilter;