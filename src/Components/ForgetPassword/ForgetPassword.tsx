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
import {
  forgetPasswordThunk,
  type SignupError,
} from "../../redux/features/auth";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../hooks/hooks";
import { useNavigate } from "react-router-dom";

export interface InitialValuesSignin {
  email: string;
}

const ForgetPassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const initialValues: InitialValuesSignin = {
    email: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().required("Email is required").email("Invalid email"),
  });

  const onSubmit = async (
    values: InitialValuesSignin,
    { resetForm }: FormikHelpers<InitialValuesSignin>,
  ) => {
    try {
      const res = await dispatch(
        forgetPasswordThunk({ email: values.email }),
      ).unwrap();
      toast.success(res.message);
      navigate("/verifyPassword");
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
          boxShadow: "10px 10px 0",
          padding: 3,
          border: "1px solid #333",
          borderRadius: 20,
          width: "75%",
        }}
      >
        <CardContent
          component={"form"}
          onSubmit={formik.handleSubmit}
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
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
            Forget Password :
          </Typography>

          <TextField
            name="email"
            id="email"
            type="email"
            value={formik.values.email}
            error={Boolean(formik.errors.email && formik.touched.email)}
            helperText={formik.touched.email && formik.errors.email}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter Your Email"
            label="Email"
          />


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
            >
              Forget Password
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ForgetPassword;
