import React from "react";
import { createHashRouter, RouterProvider } from "react-router-dom";

import { Provider } from "react-redux";
import { Toaster } from "react-hot-toast";

import { store } from "./redux/store";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "./App.css";
import { useAppDispatch } from "./hooks/hooks";
import { getMe } from "./redux/features/auth";
import { useSocket } from "./hooks/useSocket";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import FriendRequests from "./Components/Friends/FriendRequests";

/* =========================
   Lazy Components
========================= */

const Layout = React.lazy(() => import("./Components/Layout/Layout"));

const Signup = React.lazy(() => import("./Components/Signup/Signup"));

const Signin = React.lazy(() => import("./Components/Signin/Signin"));

const Home = React.lazy(() => import("./Components/Home/Home"));

const ProtectedRoute = React.lazy(
  () => import("./Components/ProtectedRoute/ProtectedRoute"),
);

const ConfirmEmail = React.lazy(
  () => import("./Components/ConfirmEmail/ConfirmEmail"),
);

const Chat = React.lazy(() => import("./Components/Chat/Chat"));

const ForgetPassword = React.lazy(
  () => import("./Components/ForgetPassword/ForgetPassword"),
);

const VerifyPassword = React.lazy(
  () => import("./Components/VerifyPassword/VerifyPassword"),
);

const ResetPassword = React.lazy(
  () => import("./Components/ResetPassword/ResetPassword"),
);

const GuestRoute = React.lazy(
  () => import("./Components/GuestRoute/GuestRoute"),
);

const AllUsers = React.lazy(() => import("./Components/Friends/AllUsers"));

const Profile = React.lazy(() => import("./Components/Profile/Profile"));

/* =========================
   App Content
========================= */

function AppContent() {
  const dispatch = useAppDispatch();
  React.useEffect(() => {
    void dispatch(getMe()).unwrap();
  }, [dispatch]);
  const router = createHashRouter([
    {
      path: "",
      element: (
        <>
          <Layout />
        </>
      ),

      children: [
        {
          path: "/",
          element: (
            <>
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            </>
          ),
        },
        {
          path: "/chat",
          element: (
            <>
              <ProtectedRoute>
                <Chat />
              </ProtectedRoute>
            </>
          ),
        },
        {
          path: "/profile",
          element: (
            <>
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            </>
          ),
        },
        {
          path: "/profile/:userId",
          element: (
            <>
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            </>
          ),
        },
        {
          path: "/friends",
          element: (
            <>
              <ProtectedRoute>
                <AllUsers />
              </ProtectedRoute>
            </>
          ),
        },
        {
          path: "/friends-requests",
          element: (
            <>
              <ProtectedRoute>
                <FriendRequests />
              </ProtectedRoute>
            </>
          ),
        },

        {
          path: "/login",
          element: (
            <GuestRoute>
              <Signin />
            </GuestRoute>
          ),
        },

        {
          path: "/register",
          element: (
            <GuestRoute>
              <Signup />
            </GuestRoute>
          ),
        },

        {
          path: "/confirmEmail",
          element: (
            <GuestRoute>
              <ConfirmEmail />
            </GuestRoute>
          ),
        },

        {
          path: "/forgetPassword",
          element: (
            <GuestRoute>
              <ForgetPassword />
            </GuestRoute>
          ),
        },

        {
          path: "/verifyPassword",
          element: (
            <GuestRoute>
              <VerifyPassword />
            </GuestRoute>
          ),
        },

        {
          path: "/resetPassword",
          element: (
            <GuestRoute>
              <ResetPassword />
            </GuestRoute>
          ),
        },
      ],
    },
  ]);

  return (
    <>
      <Toaster position="bottom-right" reverseOrder={true} />

      <RouterProvider router={router} />
    </>
  );
}

/* =========================
   App
========================= */

function App() {
  const clientId = String(import.meta.env.VITE_CLIENT_GOOGLE_ID);
  useSocket();
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <GoogleOAuthProvider clientId={clientId}>
        <Provider store={store}>
          <AppContent />
        </Provider>
      </GoogleOAuthProvider>
    </QueryClientProvider>
  );
}

export default App;
