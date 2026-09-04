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
  resetPasswordThunk,
  type SignupError,
} from "../../redux/features/auth";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../hooks/hooks";
import { useNavigate } from "react-router-dom";

export interface InitialValuesSignin {
  newPassword: string;
}

const ResetPassword = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const initialValues: InitialValuesSignin = {
    newPassword: "",
  };

  const validationSchema = Yup.object().shape({
    newPassword: Yup.string().required("New Password  is required."),
  });

  const onSubmit = async (
    values: InitialValuesSignin,
    { resetForm }: FormikHelpers<InitialValuesSignin>,
  ) => {
    try {
      const res = await dispatch(
        resetPasswordThunk({ newPassword: values.newPassword }),
      ).unwrap();

      toast.success(res.message);
      navigate("/login");
      resetForm();
    } catch (error) {

      const err = error as SignupError;
      toast.error(err.errMessage || "Something Went Wrong");
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
            Reset Password :
          </Typography>
          <TextField
            name="newPassword"
            id="newPassword"
            type="password"
            value={formik.values.newPassword}
            error={Boolean(
              formik.errors.newPassword && formik.touched.newPassword,
            )}
            helperText={formik.touched.newPassword && formik.errors.newPassword}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter your new password"
            label="New Password"
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
              Reset Password
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ResetPassword;
