import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import {
  Button,
  CircularProgress,
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
import { MagnifyingGlass, XCircle } from "phosphor-react";
import Search, {
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import { CallElement } from "../../components/CallLogElement";
import { Members_List } from "../../data";
import { useDispatch, useSelector } from "react-redux";
import { FetchFriendsList } from "../../Redux/Slices/AppSlice";

const DUMMY_MEMBERLIST = ["NAME 1", "NAME 2", "NAME 3"];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const CreateGroupChatForm = () => {
  const CreateGroupSchema = Yup.object().shape({
    title: Yup.string().required("Title is Required"),
    menbers: Yup.array().min(3, "At least Two Member is Required"),
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

export default function StartCallDialog({ open, handleClose }) {
  const { friends } = useSelector((state) => state.app);
  const [friendsList, setfriendsList] = useState(friends);
  const dispatch = useDispatch();

  const handleSearch = (e) => {
    const search = e.target.value;
    const filtered = friends.filter(
      (friend) =>
        friend.firstName.toLowerCase().includes(search.toLowerCase()) ||
        friend.lastName.toLowerCase().includes(search.toLowerCase())
    );
    setfriendsList(filtered);
  };

  useEffect(() => {
    if (friends.length == 0) {
      dispatch(FetchFriendsList());
    }
  }, []);

  useEffect(() => {
    setfriendsList(friends);
  }, [friends]);

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
          <Stack spacing={2}>
            {/* Diallog Heading */}
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              spacing={2}
            >
              <Typography variant="h5">New Call</Typography>
              <IconButton onClick={handleClose}>
                <XCircle />
              </IconButton>
            </Stack>

            {/* Search */}
            <Stack direction="row" sx={{ width: "100%" }}>
              <Search>
                <SearchIconWrapper>
                  <MagnifyingGlass color="#709CE6" />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search Groups"
                  inputProps={{ "aria-label": "search" }}
                  onChange={handleSearch}
                ></StyledInputBase>
              </Search>
            </Stack>
          </Stack>
        </DialogTitle>
        <DialogContent className="hideScrollBar" sx={{ mt: 2 }}>
          <Stack spacing={3} padding={1}>
            {/* Calls List */}
            {friendsList.length === 0 ? (
              <Stack justifyContent={"center"} alignItems={"center"}>
                <Typography variant="body">No Data Found</Typography>
              </Stack>
            ) : (
              <Stack spacing={3}>
                {friendsList.map((ele) => {
                  return (
                    <CallElement
                      key={ele.id}
                      {...ele}
                      handleClose={handleClose}
                    />
                  );
                })}
              </Stack>
            )}
          </Stack>
        </DialogContent>
      </Dialog>
    </>
  );
}
