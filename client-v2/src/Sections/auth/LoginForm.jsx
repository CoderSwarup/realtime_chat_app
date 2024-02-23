import React, { useState } from "react";
//yup
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

import FormProvider from "../../components/Form-Hook/FormProvider";
import {
  Alert,
  Button,
  IconButton,
  InputAdornment,
  Link,
  Stack,
} from "@mui/material";
import { RHFTextField } from "../../components/Form-Hook";
import { Eye, EyeSlash } from "phosphor-react";

import { Link as RouterLink } from "react-router-dom";
import { LoginUser } from "../../Redux/Slices/AuthSlice";
import { useDispatch } from "react-redux";
export default function LoginForm() {
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is Required")
      .email("Email Must Be Valid Email Address"),
    password: Yup.string().required("Password is Required"),
  });

  const defaultValues = {
    // email: "talklive@gmail.com",
    // password: "talklive123",
    email: "",
    password: "",
  };

  const methods = useForm({
    resolver: yupResolver(LoginSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const onSubmit = async (data) => {
    try {
      dispatch(LoginUser(data));
    } catch (error) {
      console.log(error);
      reset();
      setError("afterSubmit", {
        ...error,
        message: error.message,
      });
    }
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && (
          <Alert severity="error">{errors.afterSubmit.message}</Alert>
        )}
        <RHFTextField name="email" label="Email Address"></RHFTextField>
        <RHFTextField
          name="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <Eye /> : <EyeSlash />}
                </IconButton>
              </InputAdornment>
            ),
          }}
        ></RHFTextField>
      </Stack>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"flex-end"}
        my={2}
      >
        <Link
          to={"/auth/forgot-password"}
          variant="body2"
          color={"inherit"}
          underline="always"
          component={RouterLink}
        >
          Forgot Password ?
        </Link>
      </Stack>
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
      >
        Login
      </Button>
    </FormProvider>
  );
}
