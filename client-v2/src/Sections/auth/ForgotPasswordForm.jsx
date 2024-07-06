import React, { useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import FormProvider from "../../components/Form-Hook/FormProvider";
import { RHFTextField } from "../../components/Form-Hook";
import { Button, Stack } from "@mui/material";
import { useDispatch } from "react-redux";
import { ForgoutUserPassword } from "../../Redux/Slices/AuthSlice";

export default function ForgotPasswordForm() {
  const dispatch = useDispatch();
  const [sent, setSent] = useState(false);
  const ForgotPasswordSchema = Yup.object().shape({
    email: Yup.string()
      .required("Email is Required")
      .email("Email Must be Valid Email Address"),
  });

  const defaultValues = {
    email: "",
  };
  const methods = useForm({
    resolver: yupResolver(ForgotPasswordSchema),
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
      setSent(true);
      //   console.log(data);
      dispatch(ForgoutUserPassword(data));
    } catch (error) {
      // console.log(error);
      setSent(false);
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
        <RHFTextField name="email" label="Email Address"></RHFTextField>
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
          disabled={sent}
        >
          Forgot
        </Button>
      </Stack>
    </FormProvider>
  );
}
