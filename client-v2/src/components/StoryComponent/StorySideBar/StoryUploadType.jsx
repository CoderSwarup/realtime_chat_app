import { Box, Button, Stack, TextField, Typography } from "@mui/material";
import { CaretCircleLeft } from "phosphor-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setStorySidebarIndex } from "../../../Redux/Slices/StorySlice";
import RHFImageUpload from "../../Form-Hook/RHFImageUpload";
import FormProvider from "../../Form-Hook/FormProvider";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import { ShowSnackbar } from "../../../Redux/Slices/AppSlice";
import {
  useCreateImageStory,
  useCreateTextStory,
} from "../../../GraphQl/StoriesService/apis/query_api";
import LoadingScreen from "../../LoadingScreen";
const user_id = window.localStorage.getItem("user_id");
const BackButton = () => {
  const dispatch = useDispatch();
  const SetSideBarindex = () => {
    dispatch(setStorySidebarIndex(0));
  };

  return <CaretCircleLeft size={24} onClick={SetSideBarindex} />;
};

export function UploadTypeText() {
  const [text, setText] = useState("");
  const { createTextStory, data, loading, error } = useCreateTextStory();
  const dispatch = useDispatch();
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (text === "") {
      dispatch(ShowSnackbar("error", "Text is Not Empty"));
      return;
    }

    const response = await createTextStory(user_id, text);

    if (response.error) {
      dispatch(ShowSnackbar("error", "Failed to create story"));
    } else {
      dispatch(ShowSnackbar("success", "Story created successfully:"));
    }
    setText("");
    dispatch(setStorySidebarIndex(0));
  };

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <Stack position={"relative"} p={3} sx={{ height: "100vh" }} spacing={3}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"flex-start"}
        spacing={2}
      >
        <BackButton />
        <Typography variant="h4">Text </Typography>
      </Stack>

      <Stack spacing={2} width={"100%"}>
        <TextField
          label="Story Content"
          fullWidth
          variant="outlined"
          placeholder="Enter Your Content"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button onClick={handleSubmit} variant="outlined">
          Upload Story
        </Button>
      </Stack>
    </Stack>
  );
}

export function UploadTypeImage() {
  const { createImageStory, data, loading, error } = useCreateImageStory();
  const dispatch = useDispatch();
  const UploadStoryImageSchema = Yup.object().shape({
    image: Yup.mixed().required("Plaes Select Image!!"),
  });

  const defaultValues = {
    image: null,
  };

  const methods = useForm({
    resolver: yupResolver(UploadStoryImageSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful, isValid },
  } = methods;

  const onSubmit = async (data) => {
    const { image } = data;

    const response = await createImageStory(user_id, image.name, image);

    if (response.error) {
      dispatch(ShowSnackbar("error", "Failed to create story"));
    } else {
      dispatch(ShowSnackbar("success", "Story created successfully:"));
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Stack position={"relative"} p={3} sx={{ height: "100vh" }} spacing={3}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"flex-start"}
        spacing={2}
      >
        <BackButton />
        <Typography variant="h4">Image </Typography>
      </Stack>

      <Box width={"100%"} textAlign={"center"}>
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
          <RHFImageUpload name="image" label="Select Image" />
          {errors.image && (
            <Typography variant="caption" color={"red"} my={1}>
              {errors.image.message}
            </Typography>
          )}
          <Stack
            width={"100%"}
            sx={{ marginTop: 3 }}
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Button
              variant="contained"
              sx={{
                textTransform: "uppercase",
              }}
              type="submit"
            >
              Upload Story
            </Button>
          </Stack>
        </FormProvider>
      </Box>
    </Stack>
  );
}
export function UploadTypeVideo() {
  return (
    <Stack position={"relative"} p={3} sx={{ height: "100vh" }} spacing={3}>
      <Stack
        direction={"row"}
        alignItems={"center"}
        justifyContent={"flex-start"}
        spacing={2}
      >
        <BackButton />
        <Typography variant="h4">Video </Typography>
      </Stack>
    </Stack>
  );
}
