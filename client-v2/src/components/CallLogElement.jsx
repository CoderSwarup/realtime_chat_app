import { faker } from "@faker-js/faker";
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import StyledBadge from "./Conversation/StyledBadge";
import {
  ArrowDownLeft,
  ArrowUpRight,
  PhoneCall,
  VideoCamera,
} from "phosphor-react";
import { useDispatch, useSelector } from "react-redux";
import { StartCall } from "../Redux/Slices/AudioVideoCallSlice";
import { ShowSnackbar } from "../Redux/Slices/AppSlice";
import { fDateTime, fToNow } from "../utils/formatTime";
import { useCall } from "../contexts/WebRTCVideoCallContext";

export function CallLogElement({
  online,
  isIncoming,
  verdict,
  callType,
  otherUser,
  endedAt,
  startedAt,
}) {
  const { startCall } = useCall();
  const theme = useTheme();
  const dispatch = useDispatch();
  const user_id = localStorage.getItem("user_id");
  const { userdetails } = useSelector((state) => state.auth);

  const handleCall = () => {
    if (!callType || callType.trim() === "") {
      dispatch(ShowSnackbar("warning", "Something Wrong For Calling"));
    }

    startCall(callType, { _id: user_id, ...userdetails }, otherUser);
  };
  return (
    <>
      <Box
        sx={{
          width: "100%",
          borderRadius: 1,
          height: 60,
          background:
            theme.palette.mode == "light"
              ? "#F8FAFE"
              : theme.palette.background.paper,
        }}
        p={1}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          spacing={2}
        >
          <Stack direction={"row"} spacing={2}>
            {online ? (
              <StyledBadge
                variant="dot"
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              >
                <Avatar src={otherUser?.avatar?.url}></Avatar>
              </StyledBadge>
            ) : (
              <Avatar src={otherUser?.avatar?.url}></Avatar>
            )}
            <Stack spacing={0.5}>
              <Typography variant="body2">
                {otherUser.firstName + " " + otherUser.lastName}
              </Typography>
              <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                {isIncoming ? (
                  <ArrowDownLeft
                    color={
                      verdict === "Missed" || verdict === "Busy"
                        ? "red"
                        : "green"
                    }
                  />
                ) : (
                  <ArrowUpRight
                    color={
                      verdict === "Missed" || verdict === "Busy"
                        ? "red"
                        : "green"
                    }
                  />
                )}
                <Typography variant="caption">
                  {fDateTime(endedAt || startedAt)}
                </Typography>
              </Stack>
            </Stack>
          </Stack>

          <IconButton onClick={handleCall}>
            {callType == "Audio" ? (
              <PhoneCall size={25} color="green" />
            ) : (
              <VideoCamera size={25} color="green" />
            )}
          </IconButton>
        </Stack>
      </Box>
    </>
  );
}

export function CallElement({
  _id,
  status,
  avatar,
  firstName,
  lastName,
  email,
  handleClose,
}) {
  const { startCall } = useCall();
  const theme = useTheme();
  const user_id = localStorage.getItem("user_id");
  const dispatch = useDispatch();
  const { userdetails } = useSelector((state) => state.auth);
  const handleCall = (call_type) => {
    if (!call_type || call_type.trim() === "") {
      dispatch(ShowSnackbar("warning", "Something Wrong For Calling"));
    }
    startCall(
      call_type,
      {
        _id: user_id,
        ...userdetails,
      },
      {
        _id,
        status,
        avatar,
        firstName,
        lastName,
        email,
      }
    );
    handleClose();
  };
  return (
    <>
      <Box
        sx={{
          width: "100%",
          borderRadius: 1,
          height: 60,
          background:
            theme.palette.mode == "light"
              ? "#F8FAFE"
              : theme.palette.background.paper,
        }}
        p={1}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          spacing={2}
        >
          <Stack direction={"row"} spacing={3}>
            {status !== "Offline" ? (
              <StyledBadge
                variant="dot"
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              >
                <Avatar src={avatar?.url}></Avatar>
              </StyledBadge>
            ) : (
              <Avatar src={avatar?.url}></Avatar>
            )}
            <Stack spacing={0.5}>
              <Typography variant="body2">
                {firstName + " " + lastName}
              </Typography>
              <Stack direction={"row"} spacing={0.5}>
                <Typography variant="caption">{email}</Typography>
              </Stack>
            </Stack>
          </Stack>

          <Stack direction={"row"} alignItems={"center"} spacing={1}>
            <IconButton
              onClick={() => {
                handleCall("Audio");
              }}
            >
              <PhoneCall size={25} color="green" />
            </IconButton>
            <IconButton
              onClick={() => {
                handleCall("Video");
              }}
            >
              <VideoCamera size={25} color="green" />
            </IconButton>
          </Stack>
        </Stack>
      </Box>
    </>
  );
}
