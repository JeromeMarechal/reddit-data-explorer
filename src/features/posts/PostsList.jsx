import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRedditPosts } from './postsSlice.js';
import { useEffect } from 'react';
import CategoryFilter from './CategoryFilter.jsx';
import PostCard from './PostCard.jsx';
import styles from './PostList.module.css'
 
const PostList = () => {
    const dispatch = useDispatch();
    const posts = useSelector((state) => state.posts.posts);
    const status = useSelector((state) => state.posts.status);
    const error = useSelector((state) => state.posts.error);
    const { type, query, filter } = useSelector((state) => state.posts.actualParams);

    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchRedditPosts({ type, query, filter }));
        }
    }, [status, dispatch, type, query, filter]);

    if (status === 'loading') {
        return <div>Loading...</div>;
    }

    if (status === 'failed') {
        return <div>Error: {error}</div>;
    }

    return (
        <section className={styles.listContainer}>
            <div className='posts-container'>
                <h2 className={styles.resultsTitle}>
                    {type === 'search' ? `Result for '${query}'` : `Posts in ${query}`}
                </h2>
                <CategoryFilter query={query} type={type} />
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </section>
    );
};

export default PostList;

