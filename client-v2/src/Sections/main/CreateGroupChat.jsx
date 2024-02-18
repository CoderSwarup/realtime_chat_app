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
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import FormProvider from "../../components/Form-Hook/FormProvider";
import { RHFTextField } from "../../components/Form-Hook";
import RHFAutoComplete from "../../components/Form-Hook/RHFAutoComplete";
import { XCircle } from "phosphor-react";

const DUMMY_MEMBERLIST = ["NAME 1", "NAME 2", "NAME 3"];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateGroupChatForm = () => {
  const CreateGroupSchema = Yup.object().shape({
    title: Yup.string().required("Title is Required"),
    menbers: Yup.array().min(2, "At least Two Member is Required"),
  });

  const defaultValues = {
    title: "",
    menbers: [],
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
        <RHFTextField name="title" label="Group Chat Name"></RHFTextField>
        <RHFAutoComplete
          name={"menbers"}
          lable={"Members"}
          multiple
          options={DUMMY_MEMBERLIST.map((opt) => opt)}
          ChipProps={{ size: "medium" }}
        />
      </Stack>

      <Stack
        sx={{ marginTop: 3 }}
        direction={"row"}
        justifyContent={"flex-end"}
        alignItems={"center"}
      >
        <Button variant="contained" onClick={onSubmit}>
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
          <CreateGroupChatForm />
        </DialogContent>
      </Dialog>
    </>
  );
}
