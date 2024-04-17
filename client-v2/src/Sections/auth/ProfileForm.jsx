import React, { useCallback, useState, useEffect } from "react";
import * as Yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import FormProvider from "../../components/Form-Hook/FormProvider";
import {
  Alert,
  Button,
  Stack,
  Avatar,
  Box,
  CircularProgress,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { RHFTextField } from "../../components/Form-Hook";
import { UpdateUserDeatils } from "../../Redux/Slices/AuthSlice";

export default function ProfileForm() {
  const { userdetails } = useSelector((state) => state.auth);
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const user_id = window.localStorage.getItem("user_id");
  const ProfileFormSchema = Yup.object().shape({
    name: Yup.string().required("Name is Required"),
    lastname: Yup.string().required("Last Name is Required"),
    email: Yup.string()
      .required("Email is Required")
      .email("Email Must Be Valid Email Address"),
    avatarUrl: Yup.string().nullable(true),
  });

  const defaultValues = {
    name: userdetails?.firstName,
    lastname: userdetails?.lastName,
    email: userdetails.email,
    avatarUrl: userdetails.avatar,
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

  const [isValueChanged, setValueChanged] = useState(false);

  useEffect(() => {
    // Check if any value has changed
    const isAnyValueChanged = Object.keys(values).some(
      (key) => values[key] !== defaultValues[key]
    );
    setValueChanged(isAnyValueChanged);
  }, [values, defaultValues]);

  const handleDrop = useCallback(
    (acceptedFile) => {
      const file = acceptedFile[0];
      const newfile = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      if (file) {
        setValue("avatarUrl", newfile.preview, { shouldValidate: true });
        setImage(file);
      }
    },
    [setValue]
  );

  const onSubmit = async (data) => {
    try {
      // Your submission logic here
      setLoading(true);

      dispatch(
        UpdateUserDeatils(
          {
            firstName: data.name,
            lastName: data.lastname,
            avatar: image,
            filename: image?.name || "",
            user_id,
          },
          setLoading
        )
      );
    } catch (error) {
      console.log(error);
      reset();
      setError("afterSubmit", {
        ...error,
        message: error.message,
      });
    }
  };

  const handleImageClick = () => {
    // Trigger click event on file input to allow user to upload new image
    document.getElementById("fileInput").click();
  };

  return loading ? (
    <Stack
      sx={{ width: "100%", height: "100%" }}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <CircularProgress />
    </Stack>
  ) : (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={3}>
        {!!errors.afterSubmit && (
          <Alert severity="error">{errors.afterSubmit.message}</Alert>
        )}

        {/* Render profile image */}
        {values.avatarUrl ? (
          <Avatar
            src={values.avatarUrl}
            alt="Profile Picture"
            sx={{ width: 100, height: 100, cursor: "pointer" }}
            onClick={handleImageClick}
          />
        ) : (
          <Avatar
            sx={{ width: 100, height: 100, cursor: "pointer" }}
            onClick={handleImageClick}
          >
            {userdetails?.firstName[0]}{" "}
            {/* Display initial if no profile image */}
          </Avatar>
        )}

        {/* Hidden file input for image upload */}
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          style={{ display: "none" }}
          onChange={(e) => handleDrop(e.target.files)}
        />

        <RHFTextField name="name" label="First name" />
        <RHFTextField name="lastname" label="Last name" />
        <RHFTextField
          name="email"
          label="Email Address"
          value={userdetails.email}
          disabled={true}
        />

        <Stack direction="row" justifyContent="flex-end">
          <Button
            color="primary"
            variant="outlined"
            size="large"
            type="submit"
            disabled={!isValueChanged}
          >
            Save
          </Button>
        </Stack>
      </Stack>
    </FormProvider>
  );
}
