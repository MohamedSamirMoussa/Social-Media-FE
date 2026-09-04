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
import "./Signup.css";
import { signUpThunk, type SignupError } from "../../redux/features/auth";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "../../hooks/hooks";
import { useNavigate } from "react-router-dom";
import { themes } from "../../theme/theme";


// const roles = [
//   {
//     value: EnumRole.admin,
//     id: 1,
//   },
//   {
//     value: EnumRole.user,
//     id: 2,
//   },
// ];

export interface InitialValues {
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
  email: string;
  // role: EnumRole | "";
}

const Signup = () => {
  const { activeTheme } = useAppSelector((state) => state.theme);
  const currentTheme = themes[activeTheme] || themes["light"];
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const initialValues: InitialValues = {
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
    email: "",
    // role: "",
  };

  const validationSchema = Yup.object().shape({
    firstName: Yup.string().required("First name is required."),
    lastName: Yup.string().required("Last name is required."),
    password: Yup.string().required("Password  is required."),
    confirmPassword: Yup.string().required("Confirm password is required."),
    email: Yup.string().required("Email is required.").email("Invalid email"),
    // role: Yup.string().required("Role name is required."),
  });

  const onSubmit = async (
    values: InitialValues,
    { resetForm }: FormikHelpers<InitialValues>,
  ) => {
    try {
      const res = await dispatch(signUpThunk(values)).unwrap();
      toast.success(res.message);
      resetForm();
      navigate("/confirmEmail");
    } catch (error) {
      const err = error as SignupError;
      toast.error(err.errMessage);
    }
  };

  const formik = useFormik<InitialValues>({
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
            Register Form :
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 3,
            }}
          >
            <TextField
              name="firstName"
              id="firstName"
              type="text"
              value={formik.values.firstName}
              error={Boolean(
                formik.errors.firstName && formik.touched.firstName,
              )}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your first name"
              label="First name"
              variant="outlined"
              sx={{
                background: `${currentTheme.inputBack}`,
                color: currentTheme.color,
                width: "50%",
              }}
            />
            <TextField
              name="lastName"
              id="lastName"
              type="text"
              value={formik.values.lastName}
              error={Boolean(formik.errors.lastName && formik.touched.lastName)}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              placeholder="Enter your last name"
              label="Last name"
              sx={{
                background: `${currentTheme.inputBack}`,
                color: currentTheme.color,
                width: "50%",
              }}
            />
          </Box>
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

          <TextField
            name="confirmPassword"
            id="confirmPassword"
            type="password"
            value={formik.values.confirmPassword}
            error={Boolean(
              formik.errors.confirmPassword && formik.touched.confirmPassword,
            )}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Confirm your password"
            label="Confirm password"
            sx={{
              background: `${currentTheme.inputBack}`,
              color: currentTheme.color,
            }}
          />
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

          {/* <TextField
            name="role"
            id="role"
            value={formik.values.role}
            error={Boolean(formik.errors.role && formik.touched.role)}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            select
            placeholder="Select your role"
            label="Select role"
            sx={{
              boxShadow: "5px 5px 0",
            }}
          >
            {roles.map((role) => (
              <MenuItem
                key={role.id}
                value={role.value}
                defaultValue={EnumRole.user}
              >
                {role.value}
              </MenuItem>
            ))}
          </TextField> */}

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
                width: "100%"
              }}
            >
              Register
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Signup;
