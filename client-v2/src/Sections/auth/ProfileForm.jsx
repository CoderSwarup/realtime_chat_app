import React, { useCallback, useState } from "react";
//yup
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";

import FormProvider from "../../components/Form-Hook/FormProvider";
import { Alert, Button, Stack } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import { RHFTextField } from "../../components/Form-Hook";
export default function ProfileForm() {
  const ProfileFormSchema = Yup.object().shape({
    name: Yup.string().required("Name is Required"),
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
          label="User name"
          helperText={"This Name is Visible to Your Contact"}
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
