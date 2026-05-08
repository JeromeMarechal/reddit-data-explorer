import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import styles from './PostDetail.module.css';

import { fetchPostsComments } from '../features/posts/postsSlice';

const PostDetail = () => {
    const { id: postId } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const post = useSelector((state) =>
        state.posts.posts.find((post) => post.id === postId));

    const comments = useSelector((state) => state.posts.activeComments);
    const commentsStatus = useSelector((state) => state.posts.commentsStatus);

    useEffect(() => {
        if (post) {
            dispatch(fetchPostsComments({ permaLink: post.permalink, id: postId }));
        }
    }, [dispatch, post, postId]);

    const formatTimeAge = (timestamp) => {
        if (!timestamp) {
            return '';
        }
        const seconds = Math.floor(Date.now() - timestamp * 1000) / 1000;

        let interval = seconds / 86400; 
        if (interval > 1 ) {
            return Math.floor(interval) + ' days';
        }

        interval = seconds / 3600;
        if (interval > 1) {
            return Math.floor(interval) + ' hours';
        }

        interval = seconds / 60;
        if (interval > 1) {
            return Math.floor(interval) + ' minutes';
        }
    }

    const sanitizeRedditMarkdown = (text) => {
        if (!text) return '';
        return text.replace(/!\[gif\]\(giphy\|([^)]+)\)/g, '[GIF Externe](https://giphy.com/gifs/$1)');
    };

    if (!post) {
        return (
            <div className={styles.container} style={{ textAlign: 'center', padding: '50px' }}>
                <h2>Post not found</h2>
                <button className={styles.backButton} onClick={() => navigate('/')}>
                    Go back to home
                </button>
            </div>
        );
    }

    return (
        <section className={styles.container}>
            <button className={styles.backButton} onClick={() => navigate('/')}>
                Go back to home
            </button>

            <article className={styles.articleCard}>
                <header>
                    <h1 className={styles.title}>{post.title}</h1>
                    <div className={styles.meta}>
                        Par <strong>{post.author}</strong> dans r/{post.subreddit} {formatTimeAge(post.createdAt)} ago
                    </div>
                </header>

                {post.image && post.image !== 'self' && post.image !== 'default' && (
                    <img src={post.image} alt={post.title} className={styles.image} />
                )}

                {post.url && !post.text && !post.url.includes(post.permalink) && !post.image && (
                    <div className={styles.externalLink}>
                        <p style={{ margin: '0 0 10px 0' }}>Cet article renvoie vers une source externe :</p>
                        <a href={post.url} target="_blank" rel="noopener noreferrer">
                            🔗 Ouvrir le lien original ({post.url.substring(0, 40)}...)
                        </a>
                    </div>
                )}

                {post.text && (
                    <div className={styles.bodyContent}>
                        <ReactMarkdown>{sanitizeRedditMarkdown(post.text)}</ReactMarkdown>
                    </div>
                )}

                <section className={styles.commentsSection}>
                    <h3 className={styles.commentsTitle}>Commentaires ({post.comments})</h3>
                    
                    {commentsStatus === 'loading' && <p>Interception des signaux...</p>}
                    {commentsStatus === 'failed' && <p>❌ Échec de la connexion.</p>}
                    
                    {commentsStatus === 'succeeded' && comments.map((comment) => (
                        <div key={comment.id} className={styles.commentItem}>
                            <div className={styles.commentMeta}>
                                <span>{comment.author}</span>
                                <span>🕒 {formatTimeAge(comment.createdAt)}</span>
                            </div>
                            <div className={styles.commentBody}>
                                <ReactMarkdown>{sanitizeRedditMarkdown(comment.body)}</ReactMarkdown>
                            </div>
                        </div>
                    ))}
                </section>
            </article>
        </section>
    )
};

export default PostDetail;



