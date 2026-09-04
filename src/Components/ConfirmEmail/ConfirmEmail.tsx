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
  confirmEmailThunk,
  resendOTPThunk,
  type SignupError,
} from "../../redux/features/auth";
import toast from "react-hot-toast";
import { useAppDispatch } from "../../hooks/hooks";
import { useNavigate } from "react-router-dom";
import "./ConfirmEmail.css";
export interface InitialValuesSignin {
  otp: string;
}

const ConfirmEmail = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const initialValues: InitialValuesSignin = {
    otp: "",
  };

  const validationSchema = Yup.object().shape({
    otp: Yup.string()
      .required("OTP is required")
      .length(6, "OTP must be 6 digits"),
  });

  const onSubmit = async (
    values: InitialValuesSignin,
    { resetForm }: FormikHelpers<InitialValuesSignin>,
  ) => {
    try {
      const res = await dispatch(
        confirmEmailThunk({ otp: values.otp }),
      ).unwrap();
      toast.success(res.message);
      navigate("/login");
      resetForm();
    } catch (error) {
      const err = error as SignupError;
      toast.error(err.errMessage);
    }
  };

  const handleResendOTP = async () => {
    const res = await dispatch(resendOTPThunk()).unwrap();
    console.log(res);
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
            Verify Your Email :
          </Typography>

          <TextField
            name="otp"
            id="otp"
            type="text"
            value={formik.values.otp}
            error={Boolean(formik.errors.otp && formik.touched.otp)}
            helperText={formik.touched.otp && formik.errors.otp}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            placeholder="Enter OTP"
            label="OTP"
          />

          <Box
            sx={{
              display: "flex",
              justifyContent: "end",
            }}
          >
            <Button
              id="btn"
              variant="contained"
              disabled={formik.isSubmitting}
              sx={{
                backgroundColor: "transparent",
                boxShadow: "none",
                color: "#09c",
                fontWeight: 600,
              }}
              onClick={handleResendOTP}
            >
              Resend OTP
            </Button>
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
            >
              Confirm Email
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ConfirmEmail;
