import React from "react";
import PostList from "../features/posts/PostsList.jsx";
import SearchBar from "../features/search/SearchBar.jsx";
import styles from "./Home.module.css";

const Home = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Reddit Clone</h1>
        <p className={styles.subtitle}>Explore the best of the web !</p>
      </div>
      <SearchBar />
      <PostList />
    </div>
  )
}

export default Home;  