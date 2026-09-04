import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";

import { useFormik, type FormikHelpers } from "formik";
import * as Yup from "yup";
import "./Signin.css";
import {
  getMe,
  signInThunk,
  type SignupError,
} from "../../redux/features/auth";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { Link, useNavigate } from "react-router-dom";
import { themes } from "../../theme/theme";
import GoogleSignin from "../GoogleSignin/GoogleSignin";

export interface InitialValuesSignin {
  password: string;
  email: string;
}

const Signup = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { activeTheme } = useAppSelector((state) => state.theme);
  const currentTheme = themes[activeTheme] || themes["light"];

  const initialValues: InitialValuesSignin = {
    password: "",
    email: "",
  };

  const validationSchema = Yup.object().shape({
    password: Yup.string().required("Password  is required."),
    email: Yup.string().required("Email is required.").email("Invalid email"),
  });

  const onSubmit = async (
    values: InitialValuesSignin,
    { resetForm }: FormikHelpers<InitialValuesSignin>,
  ) => {
    try {
      const res = await dispatch(signInThunk(values)).unwrap();
      void (await dispatch(getMe()).unwrap());
      toast.success(res.message);
      navigate("/");
      resetForm();
    } catch (error) {
      const err = error as SignupError;
      toast.error(err.errMessage);
    }
  };

  const formik = useFormik<InitialValuesSignin>({
    initialValues,
    onSubmit,
    validationSchema,
  });

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <Card
        sx={{
          boxShadow: currentTheme.boxShadow,
          padding: 3,
          border: "1px solid #333",
          borderRadius: 20,
          width: "75%",
          backgroundColor: currentTheme.background,
        }}
      >
        <CardContent
          component={"form"}
          onSubmit={formik.handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            color: currentTheme.color,
          }}
        >
          <Typography
            variant="h1"
            className="header"
            sx={{
              fontSize: "1.8rem",
              fontWeight: "900",
            }}
          >
            Login Form :
          </Typography>

          <TextField
            name="email"
            id="email"
            type="email"
            value={formik.values.email}
            error={Boolean(formik.errors.email && formik.touched.email)}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter your email"
            label="Email"
            sx={{
              background: `${currentTheme.inputBack}`,
              color: currentTheme.color,
            }}
          />

          <TextField
            name="password"
            id="password"
            type="password"
            value={formik.values.password}
            error={Boolean(formik.errors.password && formik.touched.password)}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter your password"
            label="Password"
            sx={{
              background: `${currentTheme.inputBack}`,
              color: currentTheme.color,
            }}
          />
          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
            }}
          >
            <Link to={"/forgetPassword"}>Forget Your Password</Link>
          </Box>

          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button
              type="submit"
              variant="contained"
              disabled={formik.isSubmitting}
              sx={{
                width: "100%",
              }}
            >
              Login
            </Button>
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <GoogleSignin />
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Signup;
