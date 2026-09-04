import { GoogleLogin, type CredentialResponse } from "@react-oauth/google";

import toast from "react-hot-toast";

import { getMe, type SignupError } from "../../redux/features/auth";

import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "../../hooks/hooks";

const GoogleSignin = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleLogin = async (credentialResponse: CredentialResponse) => {
    try {
      const token = credentialResponse.credential;

      if (!token) {
        toast.error("Google token not found");
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/auth/signin-google`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token,
          }),
        },
      );

      const data = await res.json();

      if (!res.ok) {
        throw data;
      }

      await dispatch(getMe()).unwrap();

      toast.success(data.message ?? "Login successful");

      navigate("/");
    } catch (error) {
      const err = error as SignupError;
      toast.error(err?.errMessage ?? "Google login failed");

      console.error("Google signin error:", error);
    }
  };

  return (
    <GoogleLogin
      onSuccess={handleLogin}
      onError={() => {
        console.error("Google Login Failed");

        toast.error("Google Login Failed");
      }}
      size="large"
    />
  );
};

export default GoogleSignin;
