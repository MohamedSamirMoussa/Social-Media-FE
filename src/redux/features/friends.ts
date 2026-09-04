import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { IFriend, IFriendRequest } from "../../types/types";

interface IFriendInit {
  friends: IFriend[];
  requests: IFriendRequest[];
  loading: boolean;
  error: string | null;
  sendingRequestId: string | null;
}

const initialState: IFriendInit = {
  friends: [],
  requests: [],
  loading: false,
  error: null,
  sendingRequestId: null,
};

export const getAllUsers = createAsyncThunk(
  "getAll/friends",
  async (_, { rejectWithValue }) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/profile/all-users`,
      {
        method: "GET",
        credentials: "include",
      },
    );

    const { data } = await response.json();

    if (!response.ok) {
      return rejectWithValue(data);
    }

    return data;
  },
);

export const sendFriendRequest = createAsyncThunk(
  "send/friend",
  async (requestToId: string, { rejectWithValue }) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/profile/send-add-request`,
      {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({ requestToId }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    const data = await response.json();

    if (!response.ok) return rejectWithValue(data);

    return { data, requestToId };
  },
);

export const updateFriendRequest = createAsyncThunk(
  "friends/updateRequest",
  async (
    {
      friendRequestId,
      response,
    }: {
      friendRequestId: string;
      response: "accepted" | "rejected";
    },
    { rejectWithValue },
  ) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/profile/update-request`,
        {
          method: "PATCH",
          credentials: "include",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            friendRequestId,
            response,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data);
      }

      return {
        friendRequestId,
        response,
        request: data.data.request,
        message: data.message,
      };
    } catch {
      return rejectWithValue({
        errMessage: "Failed to update friend request",
      });
    }
  },
);

export const getPendingRequests = createAsyncThunk(
  "friends/allRequests",
  async (_, { rejectWithValue }) => {
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/profile/all-requests?status=pending`,
        {
          method: "GET",
          credentials: "include",
        },
      );

      const data = await res.json();

      if (!res.ok) {
        return rejectWithValue(data);
      }

      return data.data.requests;
    } catch {
      return rejectWithValue({
        errMessage: "Failed to update friend request",
      });
    }
  },
);

const friendsSlice = createSlice({
  name: "friends",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.friends = action.payload;
      })

      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(sendFriendRequest.pending, (state, action) => {
        state.sendingRequestId = action.meta.arg;
      })

      .addCase(sendFriendRequest.fulfilled, (state, action) => {
        state.sendingRequestId = null;

        const friend = state.friends.find(
          (friend) => friend._id === action.payload.requestToId,
        );

        if (friend) {
          friend.friendshipStatus = "pending_sent";
        }
      })

      .addCase(sendFriendRequest.rejected, (state) => {
        state.sendingRequestId = null;
      })
      .addCase(updateFriendRequest.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(updateFriendRequest.fulfilled, (state, action) => {
        state.loading = false;

        state.requests = state.requests.filter(
          (request) => request._id !== action.payload.friendRequestId,
        );
        if (action.payload.response === "accepted") {
          const request = action.payload.request;

          const user = state.friends?.find((user) => {
            return (
              user._id === request.requestFromId ||
              user._id === request.requestToId
            );
          });

          if (user) {
            user.friendshipStatus = "accepted";
          }
        }
      })

      .addCase(updateFriendRequest.rejected, (state, action) => {
        state.loading = false;

        state.error =
          (action.payload as { errMessage?: string })?.errMessage ??
          "Failed to update request";
      })
      .addCase(getPendingRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getPendingRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload;
      })

      .addCase(getPendingRequests.rejected, (state, action) => {
        state.loading = false;

        state.error =
          (action.payload as { errMessage?: string })?.errMessage ??
          "Failed to fetch friend requests";
      });
  },
});

export default friendsSlice.reducer;
