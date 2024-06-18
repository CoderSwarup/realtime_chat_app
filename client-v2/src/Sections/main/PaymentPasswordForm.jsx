import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { Button, Stack, Typography } from "@mui/material";
import FormProvider from "../../components/Form-Hook/FormProvider";
import RHFCodes from "../../components/Form-Hook/RHFCodes";

export default function PaymentPasswordForm({ onSubmit, title, type }) {
  const PasswordFormSchema = Yup.object().shape({
    code1: Yup.string().required("Code is Required"),
    code2: Yup.string().required("Code is Required"),
    code3: Yup.string().required("Code is Required"),
    code4: Yup.string().required("Code is Required"),
    code5: Yup.string().required("Code is Required"),
    code6: Yup.string().required("Code is Required"),
  });

  const defaultValues = {
    code1: "",
    code2: "",
    code3: "",
    code4: "",
    code5: "",
    code6: "",
  };

  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(PasswordFormSchema),
    defaultValues,
  });

  const { handleSubmit } = methods;

  return (
    <Stack spacing={3} sx={{ mb: 3, position: "relative" }}>
      <Typography variant="h3">{title}</Typography>
      <Stack spacing={3}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={2}>
            <RHFCodes
              keyName="code"
              inputs={["code1", "code2", "code3", "code4", "code5", "code6"]}
            />
            <Button
              fullWidth
              size="medium"
              color="inherit"
              type="submit"
              variant="contained"
              sx={{
                bgcolor: "text.primary",
                color: (theme) =>
                  theme.palette.mode === "light" ? "common.white" : "gray.800",
                "&:hover": {
                  bgcolor: "text.primary",
                  color: (theme) =>
                    theme.palette.mode === "light"
                      ? "common.white"
                      : "gray.800",
                },
              }}
            >
              Submit
            </Button>
          </Stack>
        </FormProvider>
      </Stack>
    </Stack>
  );
}
