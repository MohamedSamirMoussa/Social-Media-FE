import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IComment } from "../../types/types";

export interface IPostOwner {
  _id: string;
  firstName: string;
  lastName: string;
  username: string;

  profileImage?: {
    secure_url: string;
    public_id: string;
  };
}

export interface IPostAttachment {
  secure_url: string;
  public_id: string;
}

export interface IPost {
  _id: string;

  description?: string;

  ownerId: IPostOwner;

  attachments: IPostAttachment[];

  allowComments: boolean;

  tags: string[];

  likeCounts?: number;

  commentsCount?: number;

  createdAt?: string;

  isLiked: boolean;
}

interface IPostState {
  posts: IPost[];
  loading: boolean;
  error: string | null;
  comments: Record<string, IComment[]>;
}

const initialState: IPostState = {
  posts: [],
  comments: {},
  loading: false,
  error: null,
};

export const createPost = createAsyncThunk(
  "post/createPost",
  async (formData: FormData, { rejectWithValue }) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
      method: "POST",
      credentials: "include",
      body: formData,
    });

    const data = await response.json();
    if (!response.ok) {
      return rejectWithValue(data);
    }

    return data.data.post;
  },
);

export const getAllPost = createAsyncThunk(
  "post/AllPosts",
  async (_, { rejectWithValue }) => {
    const response = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
      method: "GET",
      credentials: "include",
    });

    const data = await response.json();
    if (!response.ok) {
      return rejectWithValue(data);
    }

    return data.data;
  },
);

export const deletePost = createAsyncThunk(
  "delete/post",
  async (postId: string, { rejectWithValue }) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/posts/${postId}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );

    const data = await response.json();
    if (!response.ok) return rejectWithValue(data);
    return postId;
  },
);

export const editPost = createAsyncThunk(
  "edit/post",
  async (
    { postId, description }: { postId: string; description: string },
    { rejectWithValue },
  ) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/posts/${postId}`,
      {
        method: "PATCH",
        credentials: "include",
        body: JSON.stringify({ description }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );
    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data);
    }
    return data.data.post;
  },
);

export const toggleReact = createAsyncThunk(
  "post/react",
  async (postId: string, { rejectWithValue }) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/react/${postId}/like`,
      {
        method: "POST",
        credentials: "include",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data);
    }

    return data.data;
  },
);

export const createComment = createAsyncThunk(
  "comment/create",
  async (
    {
      refId,
      content,
      onModel = "post",
    }: { refId: string; content: string; onModel?: "post" | "comment" },
    { rejectWithValue },
  ) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/comment/${refId}/comment`,
      {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content,
          onModel,
        }),
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data);
    }

    return data.data;
  },
);

export const getComments = createAsyncThunk(
  "getAll/comments",
  async (
    {
      refId,
      onModel = "post",
    }: {
      refId: string;
      onModel: "post" | "comment";
    },
    { rejectWithValue },
  ) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/comment/${refId}?onModel=${onModel}`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data);
    }

    return {
      refId,
      comments: data.data,
    };
  },
);

const postSlice = createSlice({
  name: "post",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder

      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts.unshift(action.payload);
        state.error = null;
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      })

      .addCase(getAllPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
        state.error = null;
      })
      .addCase(getAllPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      })

      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = state.posts.filter((post) => post._id !== action.payload);
        state.error = null;
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      })

      .addCase(editPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editPost.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.posts.findIndex(
          (post) => post._id === action.payload._id,
        );

        if (index !== -1) {
          state.posts[index] = action.payload;
        }

        state.error = null;
      })
      .addCase(editPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string | null;
      })

      .addCase(toggleReact.fulfilled, (state, action) => {
        const post = state.posts.find(
          (post) => post._id === action.payload.postId,
        );

        if (!post) return;
        post.isLiked = action.payload.isLiked;
        post.likeCounts = action.payload.likeCounts;
        state.error = null;
      })
      .addCase(toggleReact.rejected, (state, action) => {
        state.error = action.payload as string | null;
      })

      .addCase(createComment.fulfilled, (state, action) => {
        const { comment, refId, onModel, commentsCount } = action.payload;
        if (!state.comments[refId]) {
          state.comments[refId] = [];
        }

        state.comments[refId].push(comment);
        if (onModel === "post") {
          const post = state.posts.find((post) => post._id === refId);
          if (post && commentsCount !== undefined) {
            post.commentsCount = commentsCount;
          }
        }
      })

      .addCase(getComments.fulfilled, (state, action) => {
        state.comments[action.payload.refId] = action.payload.comments;
      });
  },
});

export default postSlice.reducer;
