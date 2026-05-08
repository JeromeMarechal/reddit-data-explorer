import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export const fetchRedditPosts = createAsyncThunk(
    'posts/fetchPosts',
    async (options) => {
        const { type, query, filter = 'hot' } = options;

        let url = '';
        if (type == 'search') {
            url = `/api/search.json?q=${query}&sort=${filter}`;
        } else {
            url = `/api/r/${query}/${filter}.json`;
        }

        console.log('Fetching from:', url, 'with params:', { type, query, filter });
        
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        
        if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        const json = await response.json();
        console.log('API Response:', json);

        if (!json.data || !json.data.children) {
            throw new Error('Unexpected API response structure: missing data.children');
        }

        return json.data.children.map((post) => {
            const previewImage = post.data.preview?.images?.[0]?.source?.url;
            const imageUrl = previewImage
                ? previewImage.replace(/&amp;/g, '&')
                : post.data.thumbnail;
            const hasValidImage = imageUrl && imageUrl.startsWith('http');

            return {
                id: post.data.id,
                title: post.data.title,
                author: post.data.author,
                subreddit: post.data.subreddit_name_prefixed,
                upvotes: post.data.ups,
                comments: post.data.num_comments,
                image: hasValidImage ? imageUrl : null,
                url: post.data.url,
                permalink: post.data.permalink,
                text: post.data.selftext,
                createdAt: post.data.created_utc,
            };
        });
    }
);

export const fetchPostsComments = createAsyncThunk(
    'posts/fetchComments',
    async ({ permaLink, id }) => {
        const cleanPermaLink = permaLink.endsWith('/') ? permaLink.slice(0, -1) : permaLink;
        const response = await fetch(`/api${cleanPermaLink}.json`);
        const json = await response.json();

        if (!json[1] || !json[1].data || !json[1].data.children) {
            throw new Error('Unexpected API response structure for comments: missing data.children');
        }

        const rawData = json[1].data.children;
        const cleanData = rawData
        .filter(item => item.kind === 't1')
        .map(item => ({
            id: item.data.id,
            author: item.data.author,
            body: item.data.body,
            upvotes: item.data.ups,
            createdAt: item.data.created_utc,
        }))

        return { postId: id, comments: cleanData };
    }
);

const postsSlice = createSlice({
    name: 'posts',
    initialState: {
        posts: [],
        status: 'idle',
        error: null,
        // Save the params of the last successful fetch
        actualParams: { type: 'subreddit', query: 'reddit', filter: 'hot' },
        activePostId: null, 
        activeComments: [],
        commentsStatus: 'idle',
    },

    reducers: {

    },

    extraReducers: (builder) => {
        builder
        // Handle fetchRedditPosts lifecycle
            .addCase(fetchRedditPosts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchRedditPosts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.posts = action.payload;
                // Update the actualParams with the params of the successful fetch
                state.actualParams = action.meta.arg;
            })
            .addCase(fetchRedditPosts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            })

        // Handle fetchPostsComments lifecycle
            .addCase(fetchPostsComments.pending, (state, action) => {
                state.commentsStatus = 'loading';
                // Empty previouscomments
                state.activeComments = [];
                state.activePostId = action.meta.arg.id;
            })
            .addCase(fetchPostsComments.fulfilled, (state, action) => {
                state.commentsStatus = 'succeeded';
                state.activeComments = action.payload.comments;
            })
            .addCase(fetchPostsComments.rejected, (state, action) => {
                state.commentsStatus = 'failed';
                state.error = action.error.message;
            });
    }
});

export default postsSlice.reducer;