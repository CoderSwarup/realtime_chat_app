import React, { useCallback, useState } from "react";
//yup
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

import FormProvider from "../../components/Form-Hook/FormProvider";
import { Alert, Button, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { RHFTextField } from "../../components/Form-Hook";
import { useSelector } from "react-redux";
export default function ProfileForm() {
  const { userdetails } = useSelector((state) => state.auth);
  const ProfileFormSchema = Yup.object().shape({
    name: Yup.string().required("Name is Required"),
    lastname: Yup.string().required("Last Name is Required"),
    email: Yup.string()
      .required("Email is Required")
      .email("Email Must Be Valid Email Address"),
    about: Yup.string().required("About is Required"),
    avatarUrl: Yup.string().required("Avatar is Required").nullable(true),
  });

  const defaultValues = {
    name: "",
    about: "",
  };

  const methods = useForm({
    resolver: yupResolver(ProfileFormSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    watch,
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = methods;

  const values = watch();

  const handleDrop = useCallback(
    (acceptedFile) => {
      const file = acceptedFile[0];
      const newfile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      if (file) {
        setValue("avatarUrl", newfile, { shouldValidate: true });
      }
    },
    [setValue]
  );

  const onSubmit = async () => {
    try {
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

        <RHFTextField
          name="name"
          label="First name"
          value={userdetails.firstName}
          // helperText={"This Name is Visible to Your Contact"}
        ></RHFTextField>
        <RHFTextField
          name="lastname"
          label="Last name"
          value={userdetails.lastName}
        ></RHFTextField>
        <RHFTextField
          name="email"
          label="Email Address"
          value={userdetails.email}
        ></RHFTextField>
        <RHFTextField
          multiline
          name="about"
          label="About"
          rows={4}
          maxRows={6}
        ></RHFTextField>

        <Stack direction={"row"} justifyContent={"flex-end"}>
          <Button color="primary" variant="outlined" size="large" type="submit">
            Save
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
}
