import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide,
  Stack,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import FormProvider from "../../components/Form-Hook/FormProvider";
import { RHFTextField } from "../../components/Form-Hook";
import RHFAutoComplete from "../../components/Form-Hook/RHFAutoComplete";
import { XCircle } from "phosphor-react";
import RHFImageUpload from "../../components/Form-Hook/RHFImageUpload";
import { useDispatch, useSelector } from "react-redux";
import { FetchFriendsList, ShowSnackbar } from "../../Redux/Slices/AppSlice";
import { socket } from "../../Socket";
import { addNewGroupCreatedConversation } from "../../Redux/Slices/ConversationSlice";
const DUMMY_MEMBERLIST = ["NAME 1", "NAME 2", "NAME 3"];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateGroupChatForm = ({ handleClose }) => {
  const { friends } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const admin = window.localStorage.getItem("user_id");

  useEffect(() => {
    dispatch(FetchFriendsList());
  }, []);

  const CreateGroupSchema = Yup.object().shape({
    title: Yup.string().required("Title is Required"),
    members: Yup.array().min(1, "At least Two Members are Required"),
    image: Yup.mixed().required("Image is Required").nullable(),
  });

  const defaultValues = {
    title: "",
    members: [],
    image: null,
  };

  const methods = useForm({
    resolver: yupResolver(CreateGroupSchema),
    defaultValues,
  });

  const {
    reset,
    setError,
    watch,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful, isValid },
  } = methods;

  const onSubmit = (data) => {
    try {
      const { title, image } = data;
      let membersIdList = [];
      data.members.map((mem) => {
        friends?.filter((f) => {
          if (f.firstName === mem) {
            membersIdList.push(f._id);
          }
        });
      });

      socket.emit(
        "create_group",
        { title, image, filename: image.name, membersIdList, admin },
        (data) => {
          if (!data.success) {
            return dispatch(ShowSnackbar("error", "Something Went Wrong!"));
          }
          dispatch(
            addNewGroupCreatedConversation({ conversation: data.conversation })
          );
          handleClose();
          dispatch(ShowSnackbar("success", "Group Created"));
          reset();
          membersIdList = [];
        }
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

  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} p={2}>
      <Stack spacing={3} my={1}>
        <RHFTextField name="title" label="Group Chat Name" />
        <RHFAutoComplete
          name={"members"}
          label={"Members"}
          multiple
          options={friends?.map((opt) => opt.firstName)}
          ChipProps={{ size: "medium" }}
        />

        <RHFImageUpload
          name="image" // Provide a unique name for the image upload field
          label="Upload Image" // Specify the label for the image upload field
          helperText="Please select an image file" // Provide helper text for the image upload field
        />
        {errors.img && <p>{errors.img.message}</p>}
      </Stack>

      <Stack
        sx={{ marginTop: 3 }}
        direction={"row"}
        justifyContent={"flex-end"}
        alignItems={"center"}
      >
        <Button variant="contained" type="submit">
          Create
        </Button>
      </Stack>
    </FormProvider>
  );
};

export default function CreateGroupChat({ open, handleClose }) {
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        aria-labelledby="Shortcut-dialog"
        aria-describedby="Keyboard-Shortcuts"
        keepMounted
        sx={{ padding: 1 }}
        TransitionComponent={Transition}
      >
        <DialogTitle>
          <Stack
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            spacing={2}
          >
            <Typography variant="h5">Create Group</Typography>
            <IconButton onClick={handleClose}>
              <XCircle />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent className="hideScrollBar" sx={{ mt: 2 }}>
          {/* Form */}
          <CreateGroupChatForm handleClose={handleClose} />
        </DialogContent>
      </Dialog>
    </>
  );
}
