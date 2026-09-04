import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { InitialValues } from "../../Components/Signup/Signup";
import type { InitialValuesSignin } from "../../Components/Signin/Signin";
import type { RootState } from "../store";

/* =========================
   Types
========================= */

export interface IProfileImage {
  secure_url: string;
  public_id: string;
}

export interface User {
  _id: string;
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  password?: string;
  role: RoleEnum;
  profileImage?: IProfileImage;
  coverImages?: IProfileImage[];
}

export interface SignupError {
  errMessage: string;
}

interface AuthResponse {
  message: string;
  status: number;
  data?: User;
  user?: User;
}

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
  email: string | null;
  isAuthenticated: boolean;
}
export enum RoleEnum {
  admin = "admin",
  user = "user",
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  email: null,
  isAuthenticated: false,
};

/* =========================
   SIGN UP
========================= */

export const signUpThunk = createAsyncThunk<
  AuthResponse,
  InitialValues,
  {
    rejectValue: SignupError;
  }
>("auth/signup", async (value, { rejectWithValue }) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(value),
  });

  const data = await res.json();

  if (!res.ok) {
    return rejectWithValue(data);
  }

  return data;
});

/* =========================
   SIGN IN
========================= */

export const signInThunk = createAsyncThunk<
  AuthResponse,
  InitialValuesSignin,
  {
    rejectValue: SignupError;
  }
>("auth/signin", async (value, { rejectWithValue }) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify(value),
  });

  const data = await res.json();

  if (!res.ok) {
    return rejectWithValue(data);
  }

  return data;
});

/* =========================
   CONFIRM EMAIL
========================= */

export const confirmEmailThunk = createAsyncThunk<
  AuthResponse,
  { otp: string },
  {
    rejectValue: SignupError;
    state: RootState;
  }
>("auth/confirmEmail", async ({ otp }, { rejectWithValue, getState }) => {
  const email = getState().auth.email;

  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/confirm-email`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        otp,
      }),
    },
  );

  const data = await res.json();

  if (!res.ok) {
    return rejectWithValue(data);
  }

  return data;
});

export const resendOTPThunk = createAsyncThunk<
  AuthResponse,
  void,
  {
    rejectValue: SignupError;
    state: RootState;
  }
>("auth/resendOTP", async (_, { rejectWithValue, getState }) => {
  const email = getState().auth.email;
  console.log(email);

  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/resend-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  // console.log(data);

  if (!res.ok) {
    return rejectWithValue(data);
  }

  return data;
});

export const forgetPasswordThunk = createAsyncThunk<
  AuthResponse,
  { email: string },
  {
    rejectValue: SignupError;
  }
>("auth/forgetPassword", async ({ email }, { rejectWithValue }) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/forget-password`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
      credentials: "include",
    },
  );

  const data = await res.json();

  if (!res.ok) {
    return rejectWithValue(data);
  }

  return data;
});

export const verifyPasswordThunk = createAsyncThunk<
  AuthResponse,
  { otp: string },
  {
    rejectValue: SignupError;
    state: RootState;
  }
>("auth/verifyPassword", async ({ otp }, { rejectWithValue, getState }) => {
  const email = getState().auth.email;
  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/verify-otp`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
    body: JSON.stringify({ email, otp }),
  });

  const data = await res.json();

  if (!res.ok) {
    return rejectWithValue(data);
  }

  return data;
});

export const resetPasswordThunk = createAsyncThunk<
  AuthResponse,
  { newPassword: string },
  {
    rejectValue: SignupError;
    state: RootState;
  }
>("auth/resetPassword", async ({ newPassword }, { rejectWithValue }) => {
  const res = await fetch(
    `${import.meta.env.VITE_API_URL}/auth/reset-password`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ newPassword }),
    },
  );

  const data = await res.json();
  console.log(data);

  if (!res.ok) {
    return rejectWithValue(data);
  }

  return data;
});

/* =========================
   GET ME
========================= */

export const getMe = createAsyncThunk<
  AuthResponse,
  void,
  {
    rejectValue: SignupError;
  }
>("auth/getme", async (_, { rejectWithValue }) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/me`, {
    method: "GET",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    return rejectWithValue(data);
  }

  return data;
});

/* =========================
   LOGOUT
========================= */

export const logoutThunk = createAsyncThunk<
  AuthResponse,
  void,
  {
    rejectValue: SignupError;
  }
>("auth/logout", async (_, { rejectWithValue }) => {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/auth/logout`, {
    method: "POST",
    credentials: "include",
  });

  const data = await res.json();

  if (!res.ok) {
    return rejectWithValue(data);
  }

  return data;
});

/* =========================
   SLICE
========================= */

const auth = createSlice({
  name: "auth",
  initialState,

  reducers: {},

  extraReducers: (builder) => {
    builder

      /* =====================
         SIGN UP
      ===================== */

      .addCase(signUpThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(signUpThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        state.email = action.meta.arg.email;

        // Signup doesn't mean authenticated
        state.isAuthenticated = false;
      })

      .addCase(signUpThunk.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload?.errMessage || "Something went wrong";
      })

      /* =====================
         SIGN IN
      ===================== */

      .addCase(signInThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(signInThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;

        // Cookies are handled by backend
        // Authentication will be confirmed through getMe()
        state.isAuthenticated = true;
      })

      .addCase(signInThunk.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;

        state.error = action.payload?.errMessage || "Something went wrong";
      })

      /* =====================
         CONFIRM EMAIL
      ===================== */

      .addCase(confirmEmailThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(confirmEmailThunk.fulfilled, (state) => {
        state.loading = false;
        state.email = null;
        state.error = null;
      })

      .addCase(confirmEmailThunk.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload?.errMessage || "Something went wrong";
      })

      /* =====================
         GET ME
      ===================== */

      .addCase(getMe.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(getMe.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        // API:
        // {
        //   message: "Done",
        //   data: {...user}
        // }

        state.user = action.payload.data ?? null;

        state.isAuthenticated = action.payload.data != null;
      })

      .addCase(getMe.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      /* =====================
         LOGOUT
      ===================== */

      .addCase(logoutThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(logoutThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;

        state.user = null;
        state.email = null;
        state.isAuthenticated = false;
      })

      .addCase(logoutThunk.rejected, (state, action) => {
        state.loading = false;

        state.user = null;
        state.email = null;
        state.isAuthenticated = false;

        state.error = action.payload?.errMessage || "Logout failed";
      })

      .addCase(resendOTPThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(resendOTPThunk.fulfilled, (state) => {
        state.loading = false;
        state.email = null;
        state.error = null;
      })

      .addCase(resendOTPThunk.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload?.errMessage || "Something went wrong";
      })

      .addCase(forgetPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(forgetPasswordThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.email = action.meta.arg.email;
        state.error = null;
      })

      .addCase(forgetPasswordThunk.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload?.errMessage || "Something went wrong";
      })

      .addCase(verifyPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(verifyPasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })

      .addCase(verifyPasswordThunk.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload?.errMessage || "Something went wrong";
      })

      .addCase(resetPasswordThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })

      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.email = null;
      })

      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.loading = false;

        state.error = action.payload?.errMessage || "Something went wrong";
      });
  },
});

export default auth.reducer;
