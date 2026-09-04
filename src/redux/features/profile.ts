import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

interface IImage {
  secure_url: string;
  public_id?: string;
}

interface IProfile {
  profileImage: IImage;
  coverImages: IImage[];
  loading: boolean;
  error: string | null;
}

const initialState: IProfile = {
  loading: false,

  profileImage: {
    secure_url: "",
  },

  coverImages: [],

  error: null,
};

export const profileImageThunk = createAsyncThunk(
  "profile/image",
  async (file: File, { rejectWithValue }) => {
    const formData = new FormData();

    formData.append("image", file);

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/profile/profile-image`,
      {
        method: "PUT",
        credentials: "include",
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data);
    }

    return data;
  },
);

export const coverImagesThunk = createAsyncThunk(
  "profile/coverImages",
  async (files: File[], { rejectWithValue }) => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("images", file);
    });

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/profile/cover-images`,
      {
        method: "PUT",
        credentials: "include",
        body: formData,
      },
    );

    const data = await response.json();

    if (!response.ok) {
      return rejectWithValue(data);
    }

    return data;
  },
);

const profileSlice = createSlice({
  name: "profile",

  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder
      .addCase(profileImageThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(profileImageThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.profileImage = action.payload.data.profileImage;
      })

      .addCase(profileImageThunk.rejected, (state, action) => {
        state.loading = false;

        const payload = action.payload as {
          errMessage?: string;
        };

        state.error =
          payload?.errMessage ||
          action.error.message ||
          "Failed to upload profile image";
      })

      .addCase(coverImagesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(coverImagesThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.coverImages = action.payload.data.coverImages;
      })

      .addCase(coverImagesThunk.rejected, (state, action) => {
        state.loading = false;

        const payload = action.payload as {
          errMessage?: string;
        };

        state.error =
          payload?.errMessage ||
          action.error.message ||
          "Failed to upload cover images";
      });
  },
});

export default profileSlice.reducer;
