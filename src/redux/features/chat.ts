import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface IChatAttachment {
  secure_url: string;
  public_id: string;
}

interface IChatState {
  uploadingAttachments: boolean;

  error: string | null;
}

const initialState: IChatState = {
  uploadingAttachments: false,

  error: null,
};

export const uploadChatAttachments = createAsyncThunk(
  "chat/uploadAttachments",
  async (files: File[], { rejectWithValue }) => {
    const formData = new FormData();

    files.forEach((file) => {
      formData.append("attachments", file);
    });

    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/chats/attachments`,
      {
        method: "POST",
        credentials: "include",
        body: formData,
      },
    );

    const data = await response.json();
    if (!response.ok) {
      return rejectWithValue(data);
    }

    return data.data.attachments as IChatAttachment[];
  },
);

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(uploadChatAttachments.pending, (state) => {
        state.uploadingAttachments = true;
        state.error = null;
      })
      .addCase(uploadChatAttachments.fulfilled, (state) => {
        state.uploadingAttachments = false;
        state.error = null;
      })
      .addCase(uploadChatAttachments.rejected, (state, action) => {
        state.uploadingAttachments = false;
        state.error = action.payload as string | null;
      });
  },
});

export default chatSlice.reducer;
