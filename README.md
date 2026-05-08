# Reddit Data Explorer

> A high-fidelity, asynchronous data exploration client built with React and Redux Toolkit, interfacing directly with the public Reddit JSON API.

## 🎯 Executive Summary
This project is not just a UI clone; it is a demonstration of strict front-end architecture. It showcases centralized state management for complex asynchronous data flows, client-side routing with memory-loss safeguards, data sanitization, and strict CSS encapsulation using CSS Modules and a "Spatial UI" design language.

## ⚙️ Tactical Stack
* **Core:** React 18
* **State Management:** Redux Toolkit (Slices, `createAsyncThunk`)
* **Routing:** React Router DOM v6
* **Data Parsing:** `react-markdown` (with custom sanitization pre-processing)
* **Styling:** CSS Modules (Component-scoped, zero-collision architecture)
* **Build Tool:** Vite

## 🧠 Technical Challenges & Architectural Solutions

### 1. Asynchronous State & Error Handling
Handling external APIs requires robust state machines. The application utilizes Redux Toolkit's `createAsyncThunk` to manage network requests. The UI reactively adapts to `pending`, `fulfilled`, and `rejected` states, ensuring the user is never left with a blank screen during network latency or API failures.

### 2. Memory-Loss Safeguards in Single Page Applications (SPA)
When routing to a specific post (`/post/:postId`), the application reads from the centralized Redux store using the URL parameter. However, to prevent crashes on hard refreshes (F5) where the Redux state is cleared, a fallback mechanism immediately redirects the user to safety, preventing runtime `undefined` errors.

### 3. Proprietary Markdown Sanitization
Reddit's API delivers raw, proprietary markdown (e.g., `![gif](giphy|...)` for internal GIFs). Injecting this directly into a standard markdown parser results in broken images. A custom pre-processing layer (`sanitizeRedditMarkdown`) was engineered to intercept these proprietary tokens and convert them into safe, clickable external links before the data reaches the UI layer.

### 4. Strict Visual Encapsulation (CSS Modules)
To prevent the cascading chaos of global CSS, every component utilizes CSS Modules. Classes are hashed during compilation (e.g., `.title` becomes `.PostCard_title__x89f`), guaranteeing zero stylistic collisions across the application. The design implements a "Spatial UI" (glassmorphism) relying heavily on `backdrop-filter` and soft layered shadows to create depth.

## 🔄 Data Flow Architecture
1. **Trigger:** The UI (e.g., `SearchBar` or `CategoryFilter`) dispatches a Thunk.
2. **Network Layer:** The Thunk intercepts the action, hits the Reddit API (`/search.json` or `/r/[category].json`), and formats the raw JSON into a sanitized schema.
3. **Reducers:** The `postsSlice` updates the global store based on the Thunk's lifecycle.
4. **Reactivity:** Components subcribed via `useSelector` instantly re-render to reflect the new data, time-formatting (`formatTimeAgo`), and markdown parsing.

## 🚀 Installation & Local Deployment

# Clone the repository
git clone [https://github.com/JeromeMarechal/reddit-data-explorer.git](https://github.com/YOUR_USERNAME/reddit-data-explorer.git)

# Navigate to the directory
cd reddit-data-explorer

# Install dependencies
npm install

# Start the local development server
npm run dev
