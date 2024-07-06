import React, { useState } from "react";
import FormProvider from "../../components/Form-Hook/FormProvider";
import {
  Alert,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Stack,
  Typography,
} from "@mui/material";

import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { RHFTextField } from "../../components/Form-Hook";
import { Eye, EyeSlash } from "phosphor-react";
import { Link as RouterLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import { RegisterUser } from "../../Redux/Slices/AuthSlice";

export default function RegisterForm() {
  const [isSent, setIssent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const RegisterFormSchema = Yup.object().shape({
    firstName: Yup.string().required("First Name is Required"),
    lastName: Yup.string().required("LastName Name is Required"),
    email: Yup.string()
      .required("Email is Required")
      .email("Email Must Be Valid Email Address"),
    password: Yup.string().required("Password is Required").min(5),
  });

  const defaultValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  };

  const methods = useForm({
    resolver: yupResolver(RegisterFormSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors },
  } = methods;
  const onSubmit = async (data) => {
    try {
      setIssent(true);
      dispatch(RegisterUser(data));
    } catch (error) {
      console.log(error);
      setIssent(false);
      reset();
      setError("afterSubmit", {
        ...error,
        message: error.message,
      });
    }
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        {!!errors.afterSubmit && (
          <Alert severity="error">{errors.afterSubmit.message}</Alert>
        )}

        <Stack
          direction={"row"}
          spacing={2}
          justifyContent={"space-between"}
          alignItems={"center"}
        >
          <RHFTextField name={"firstName"} label={"First Name"} />
          <RHFTextField name={"lastName"} label={"Last Name"} />
        </Stack>
        <RHFTextField name={"email"} label={"Email"} />
        <RHFTextField
          name={"password"}
          label={"Password"}
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    setShowPassword((prev) => !prev);
                  }}
                >
                  {showPassword ? <Eye /> : <EyeSlash />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Stack>
      <Stack spacing={2} mt={3}>
        <Button
          fullWidth
          size="large"
          color="inherit"
          type="submit"
          variant="contained"
          sx={{
            bgcolor: "text.primary",
            color: (theme) =>
              theme.palette.mode == "light" ? "common.white" : "gray.800",
            "&:hover": {
              bgcolor: "text.primary",
              color: (theme) =>
                theme.palette.mode == "light" ? "common.white" : "gray.800",
            },
          }}
          disabled={isSent}
        >
          Create Account
        </Button>
        <Typography variant="body2" textAlign={"center"}>
          By Signin Up I agree{" "}
          <Link top={"/auth/register"} component={RouterLink}>
            Terms And Conditon
          </Link>{" "}
          and{" "}
          <Link top={"/auth/register"} component={RouterLink}>
            Privacy Policy
          </Link>
        </Typography>
      </Stack>
    </FormProvider>
  );
}
