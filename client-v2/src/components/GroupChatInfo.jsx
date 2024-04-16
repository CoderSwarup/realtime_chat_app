import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  IconButton,
  Slide,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  BellSimpleSlash,
  CaretRight,
  Notification,
  Phone,
  Prohibit,
  Star,
  Trash,
  TrashSimple,
  UserCircle,
  VideoCamera,
  X,
} from "phosphor-react";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  SelectConversation,
  ToggleSideBar,
  UpdateSidebarType,
} from "../Redux/Slices/AppSlice";
import { faker } from "@faker-js/faker";
import AntSwitch from "./AntSwitch";
import { socket } from "../Socket";
import {
  RemoveTheGroup,
  SetCurrentGroupConversation,
} from "../Redux/Slices/ConversationSlice";
import {
  AddMember,
  RemoveMembersFromGroup,
} from "../Sections/main/AddRemoveMember";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const BlockDialog = ({ open, handleClose }) => {
  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>{"Block This Groupp"}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Are You Sure you wnat to block this Group ?
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={() => {
            handleClose();
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const DeleteDialog = ({ open, handleClose, type }) => {
  const { room_id } = useSelector((state) => state.app);
  const user_id = window.localStorage.getItem("user_id");
  const dispatch = useDispatch();

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
    >
      <DialogTitle>
        {type === "exit" ? "Exit From This Group" : "Delete Group"}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-slide-description">
          Are You Sure you want to{" "}
          {type === "exit" ? "Exit From this Group ?" : "Delete This Group"}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={() => {
            dispatch(SelectConversation({ room_id: null, chat_type: null }));
            dispatch(SetCurrentGroupConversation(null));

            if (type === "exit") {
              socket.emit("exit_group", { room_id, user_id }, (data) => {
                if (data.success) {
                  dispatch(RemoveTheGroup(data.room_id));
                }
              });
            }
            if (type === "delete") {
              socket.emit("delete_group", { room_id, user_id }, (data) => {
                if (data.success) {
                  dispatch(RemoveTheGroup(data.room_id));
                }
              });
            }

            handleClose();
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default function GroupChatInfo({ FiltertedMedia }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { current_conversation, current_messages } = useSelector(
    (state) => state.conversation.group_chat
  );
  const [isAdmin, setIsAdmin] = useState(false);
  const [type, setType] = useState("");
  //Dialog
  const [openBlock, setOpenBlock] = useState(false);

  const handleCloseBlock = () => {
    setOpenBlock(false);
  };

  // Delete Dialog
  const [openDelete, setOpenDelete] = useState(false);
  const handleCloseDelete = () => {
    setOpenDelete(false);
  };

  //Add Member Dialog
  const [AddnewMember, setAddNewMember] = useState(false);
  const handleCloseAddNewMember = () => {
    setAddNewMember(false);
  };

  //Remove Member
  const [removeMember, setremoveMember] = useState(false);
  const handleCloseRemoveMember = () => {
    setremoveMember(false);
  };
  useEffect(() => {
    current_conversation?.admins.forEach((admin) => {
      if (admin._id === localStorage.getItem("user_id")) {
        setIsAdmin(true);
      }
    });
  }, [current_conversation]);
  return (
    <Box
      sx={{
        background: theme.palette.background.paper,
        width: 320,
        position: "absolute",
        top: 0,
        right: 0,
        height: "100vh",
      }}
    >
      <Stack sx={{ height: "100%", width: "100%" }}>
        {/* Header box */}
        <Box
          sx={{
            boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
            width: "100%",
            background:
              theme.palette.mode == "light"
                ? "#FAFAFF"
                : theme.palette.background.default,
          }}
        >
          <Stack
            sx={{ height: "100%", padding: 2 }}
            direction={"row"}
            alignItems={"center"}
            spacing={3}
            justifyContent={"space-between"}
          >
            <Typography variant="subtitle2">Group Info</Typography>
            <IconButton
              onClick={() => {
                dispatch(ToggleSideBar());
              }}
            >
              <X />
            </IconButton>
          </Stack>
        </Box>

        {/* Main Body */}
        <Stack
          className="hideScrollBar"
          sx={{
            height: "100%",
            position: "relative",
            flexGrow: 1,
            overflowY: "scroll",
          }}
          p={3}
          spacing={3}
        >
          {/* Simple Info Name and Contact number */}
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <Avatar
              src={current_conversation?.img}
              alt={current_conversation?.name}
            ></Avatar>

            <Stack spacing={0.5}>
              <Typography variant="article" fontWeight={600}>
                {current_conversation?.name}
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                {current_conversation?.email}
              </Typography>
            </Stack>
          </Stack>

          {/* Calling Features */}
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-evenly"}
            spacing={2}
          >
            <Stack alignItems={"center"} spacing={0.5}>
              <IconButton>
                <VideoCamera />
              </IconButton>
              <Typography variant="overline"> Video</Typography>
            </Stack>
            <Stack alignItems={"center"} spacing={0.5}>
              <IconButton>
                <Phone />
              </IconButton>
              <Typography variant="overline"> Voice</Typography>
            </Stack>
          </Stack>

          {/* Divider */}
          <Divider width="100%"></Divider>

          {/* About Info */}
          <Stack spacing={1}>
            <Typography variant="article">About</Typography>
            <Typography variant="body2" fontWeight={200}>
              Only coding
            </Typography>
          </Stack>

          {/* Divider */}
          <Divider width="100%"></Divider>

          {/* Add and Remove Members */}
          {isAdmin && (
            <Stack>
              <Stack
                direction={"row"}
                alignItems={"center"}
                justifyContent={"space-evenly"}
                spacing={2}
              >
                <Button
                  onClick={() => setremoveMember(true)}
                  startIcon={<Prohibit />}
                  fullWidth
                  variant="outlined"
                >
                  Remove Members
                </Button>
                <Button
                  onClick={() => setAddNewMember(true)}
                  startIcon={<UserCircle />}
                  fullWidth
                  variant="outlined"
                >
                  Add Members
                </Button>
              </Stack>
            </Stack>
          )}

          {/* Media Link Docs */}
          <Stack spacing={3}>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography variant="subtitle">Media Links and Docs</Typography>
              <Button
                onClick={() => {
                  dispatch(UpdateSidebarType("SHARED"));
                }}
                endIcon={<CaretRight />}
              >
                {FiltertedMedia?.length}
              </Button>
            </Stack>

            {/* Media Images */}

            <Stack direction={"row"} spacing={2} alignItems={"center"}>
              {FiltertedMedia?.slice(
                FiltertedMedia.length - 4,
                FiltertedMedia.length - 1
              ).map((e) => {
                return (
                  <Box>
                    <img src={e.img} alt={faker.person.fullName()}></img>
                  </Box>
                );
              })}
            </Stack>

            {/* Divider */}
            <Divider width="100%"></Divider>

            {/* Starred Message */}
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              spacing={2}
            >
              <Stack direction={"row"} spacing={2} alignItems={"center"}>
                <Star size={21} />
                <Typography variant="subtitle2">Starred Message</Typography>
              </Stack>
              <IconButton
                onClick={() => {
                  dispatch(UpdateSidebarType("STARRED"));
                }}
              >
                <CaretRight />
              </IconButton>
            </Stack>

            {/* Divider */}
            <Divider width="100%"></Divider>

            {/* Mute Notification */}
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              spacing={2}
            >
              <Stack direction={"row"} spacing={2} alignItems={"center"}>
                <BellSimpleSlash size={21} />
                <Typography variant="subtitle2">Mute Notifications</Typography>
              </Stack>

              <AntSwitch />
            </Stack>

            {/* Divider */}
            <Divider width="100%"></Divider>

            <Typography variant="body1" fontWeight={700}>
              Group Admins
            </Typography>

            {/* Groups Admins list */}

            <Stack
              direction={"column"}
              spacing={2}
              maxHeight={200}
              className="hideScrollBar"
            >
              {current_conversation?.admins.map((ele) => {
                return (
                  <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    <Avatar
                      src={faker.image.url()}
                      alt={faker.person.fullName()}
                    ></Avatar>

                    <Stack spacing={0.2}>
                      <Typography variant="article" fontWeight={600}>
                        {`${ele.firstName} ${ele.lastName}`}
                        <Typography variant="body2" color={"gray"}>
                          (Admin)
                        </Typography>
                      </Typography>
                    </Stack>
                  </Stack>
                );
              })}
            </Stack>

            {/* Divider */}
            <Divider width="100%"></Divider>

            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography variant="body1" fontWeight={700}>
                Group Members
              </Typography>
              <Typography variant="body1" fontWeight={700} color={"gray"}>
                {current_conversation?.participants?.length}
              </Typography>
            </Stack>

            {/* Groups Members list */}

            <Stack
              direction={"column"}
              spacing={2}
              maxHeight={200}
              className="hideScrollBar"
            >
              {current_conversation?.participants?.map((ele) => {
                return (
                  <Stack direction={"row"} alignItems={"center"} spacing={2}>
                    <Avatar
                      src={faker.image.url()}
                      alt={faker.person.fullName()}
                    ></Avatar>

                    <Stack spacing={0.2}>
                      <Typography variant="article" fontWeight={600}>
                        {`${ele.firstName} ${ele.lastName}`}
                      </Typography>
                      <Typography variant="caption" fontWeight={200}>
                        {ele.email}
                      </Typography>
                    </Stack>
                  </Stack>
                );
              })}
            </Stack>

            {/* Buttons  */}
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-evenly"}
              spacing={2}
            >
              <Button
                onClick={() => setOpenBlock(true)}
                startIcon={<Prohibit />}
                fullWidth
                variant="outlined"
              >
                Block
              </Button>
              <Button
                onClick={() => {
                  setType("exit");
                  setOpenDelete(true);
                }}
                startIcon={<Trash />}
                fullWidth
                variant="outlined"
              >
                Exit
              </Button>
            </Stack>

            {isAdmin && (
              <Box>
                <Button
                  onClick={() => {
                    setType("delete");
                    setOpenDelete(true);
                  }}
                  startIcon={<TrashSimple />}
                  fullWidth
                  variant="outlined"
                >
                  Delete Group
                </Button>
              </Box>
            )}
          </Stack>
        </Stack>
      </Stack>
      {openBlock && (
        <BlockDialog open={openBlock} handleClose={handleCloseBlock} />
      )}
      {openDelete && (
        <DeleteDialog
          type={type}
          open={openDelete}
          handleClose={handleCloseDelete}
        ></DeleteDialog>
      )}

      <AddMember open={AddnewMember} handleClose={handleCloseAddNewMember} />
      <RemoveMembersFromGroup
        open={removeMember}
        handleClose={handleCloseRemoveMember}
        p
      />
    </Box>
  );
}
