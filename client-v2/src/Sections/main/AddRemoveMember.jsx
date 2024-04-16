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
import { AddRemoveMembersInTheGroup } from "../../Redux/Slices/ConversationSlice";

const DUMMY_MEMBERLIST = ["NAME 1", "NAME 2", "NAME 3"];

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Add Member

const AddNewMember = ({ handleClose }) => {
  const { friends } = useSelector((state) => state.app);
  const dispatch = useDispatch();
  const current_user = window.localStorage.getItem("user_id");
  const [filterFriends, setFilterFriends] = useState([]);
  const { current_conversation } = useSelector(
    (state) => state.conversation.group_chat
  );

  const CreateGroupSchema = Yup.object().shape({
    members: Yup.array().min(1, "At least One Members are Required"),
  });

  const defaultValues = {
    members: [],
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
      let membersIdList = [];
      data.members.map((mem) => {
        friends?.filter((f) => {
          if (f.firstName === mem) {
            membersIdList.push(f._id);
          }
        });
      });

      socket.emit(
        "add_member_in_group",
        {
          room_id: current_conversation.id,
          member_ids: membersIdList,
        },
        (data) => {
          dispatch(
            ShowSnackbar(data.success ? "success" : "warning", data.message)
          );
          handleClose();
          if (data.participants) {
            dispatch(AddRemoveMembersInTheGroup(data.participants));
          }
          reset();
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
  useEffect(() => {
    dispatch(FetchFriendsList());
  }, []);
  useEffect(() => {
    let filteredParticipants = current_conversation?.participants?.filter(
      (participant) => participant?._id !== current_user
    );
    const participantIds = filteredParticipants?.map(
      (participant) => participant?._id
    );

    // Filter out friends who are not participants in the group
    const friendsNotParticipants = friends?.filter(
      (friend) => !participantIds?.includes(friend._id)
    );

    setFilterFriends(friendsNotParticipants);
  }, [friends, current_conversation]);
  return (
    <>
      {filterFriends.length !== 0 ? (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} p={2}>
          <Stack spacing={3} my={1}>
            <RHFAutoComplete
              name={"members"}
              label={"Members"}
              multiple
              options={filterFriends?.map((opt) => opt.firstName)}
              ChipProps={{ size: "medium" }}
            />
          </Stack>

          <Stack
            sx={{ marginTop: 3 }}
            direction={"row"}
            justifyContent={"flex-end"}
            alignItems={"center"}
          >
            <Button variant="contained" type="submit">
              Add Members
            </Button>
          </Stack>
        </FormProvider>
      ) : (
        <Typography
          textAlign={"center"}
          sx={{ textTransform: "uppercase" }}
          variant="h3"
        >
          No available friend to add
        </Typography>
      )}
    </>
  );
};

export function AddMember({ open, handleClose }) {
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        aria-labelledby="Add Member"
        aria-describedby="Add Member in Group"
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
            <Typography variant="h5">Add Members In Group</Typography>
            <IconButton onClick={handleClose}>
              <XCircle />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent className="hideScrollBar" sx={{ mt: 2 }}>
          {/* Form */}
          <AddNewMember handleClose={handleClose} />
        </DialogContent>
      </Dialog>
    </>
  );
}

//Remove Members
const RemoveMembers = ({ handleClose }) => {
  const dispatch = useDispatch();
  const current_user = window.localStorage.getItem("user_id");

  const [filteredPaticipants, setfilteredPaticipants] = useState([]);

  const { current_conversation } = useSelector(
    (state) => state.conversation?.group_chat
  );

  const CreateGroupSchema = Yup.object().shape({
    members: Yup.array().min(1, "At least One Members are Required"),
  });

  const defaultValues = {
    members: [],
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
      let membersList = [];
      data.members.map((mem) => {
        current_conversation.participants?.filter((f) => {
          if (f.firstName === mem) {
            membersList.push({
              memberid: f._id,
              membername: f.firstName,
            });
          }
        });
      });

      socket.emit(
        "remove_member_from_group",
        {
          room_id: current_conversation.id,
          membersList,
        },
        (data) => {
          dispatch(
            ShowSnackbar(data.success ? "success" : "warning", data.message)
          );
          reset();
          handleClose();
          if (data.participants) {
            dispatch(AddRemoveMembersInTheGroup(data.participants));
          }
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

  useEffect(() => {
    let filterdList = current_conversation?.participants?.filter(
      (participant) => participant?._id !== current_user
    );

    setfilteredPaticipants(filterdList);
  }, [current_conversation]);
  return (
    <>
      {filteredPaticipants?.length !== 0 ? (
        <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)} p={2}>
          <Stack spacing={3} my={1}>
            <RHFAutoComplete
              name={"members"}
              label={"Members"}
              multiple
              options={filteredPaticipants?.map((opt) => opt.firstName)}
              ChipProps={{ size: "medium" }}
            />
          </Stack>

          <Stack
            sx={{ marginTop: 3 }}
            direction={"row"}
            justifyContent={"flex-end"}
            alignItems={"center"}
          >
            <Button
              sx={{ backgroundColor: "red" }}
              variant="contained"
              type="submit"
            >
              Remove
            </Button>
          </Stack>
        </FormProvider>
      ) : (
        <Typography
          textAlign={"center"}
          sx={{ textTransform: "uppercase" }}
          variant="h3"
        >
          No Participants Available in the Group
        </Typography>
      )}
    </>
  );
};

export function RemoveMembersFromGroup({ open, handleClose }) {
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="sm"
        aria-labelledby="Remove Members"
        aria-describedby="Remove Members From Group"
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
            <Typography variant="h5">Remove Members From Group</Typography>
            <IconButton onClick={handleClose}>
              <XCircle />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent className="hideScrollBar" sx={{ mt: 2 }}>
          {/* Form */}
          <RemoveMembers handleClose={handleClose} />
        </DialogContent>
      </Dialog>
    </>
  );
}
