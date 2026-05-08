import React from "react";
import { useNavigate } from "react-router-dom";

import styles from "./PostCard.module.css";

export const PostCard = ({ post }) => {
    const navigate = useNavigate();
    const hasImage = post.image && post.image !== 'self' && post.image !== 'default';
    const handleOpenPost = () => {
        navigate(`/post/${post.id}`);
    };

    return (
        <article className={styles.card} onClick={handleOpenPost}>
            <h3 className={styles.title}>{post.title}</h3>
            
            <div className={styles.meta}> 
                <strong>BY {post.author}</strong>
            </div>

            <div className={styles.contentWrapper}>
                {hasImage && (
                    <img src={post.image} alt="Thumbnail" className={styles.thumbnail} />
                )}
            </div>

            <div>
                <span className={styles.upvotes}>{post.upvotes} upvotes</span>
                <span className={styles.comments}>{post.comment_count} comments</span>
            </div>

        </article>
    )

}

export default PostCard;