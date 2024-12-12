import { useState } from "react";
import { Avatar, IconButton, Stack, Typography, useTheme } from "@mui/material";
import { PhoneDisconnect, PhoneOutgoing, VideoCamera } from "phosphor-react";
import { socket } from "../../Socket";
import { useCall } from "../../contexts/WebRTCVideoCallContext";
import { useDispatch } from "react-redux";
import { ShowSnackbar } from "../../Redux/Slices/AppSlice";

export default function DaillingDialog() {
  const dispatch = useDispatch();
  const theme = useTheme();
  const { inComingCallDetails, callToUserDetails, resetCallData } = useCall();

  const handleCutOrMissedCall = () => {
    if (callToUserDetails) {
      const { call_id, from, to, call_type } = callToUserDetails;
      socket.emit("MISSED_CALL", { call_id, from, to, call_type }, (data) => {
        if (data.status) {
          dispatch(ShowSnackbar("success", "Call Disconnect"));
        } else {
          dispatch(
            ShowSnackbar("error", data?.message || "SomeThing Went Wrong")
          );
        }
        resetCallData();
      });
    }
  };

  return (
    <Stack
      sx={{
        width: {
          xs: "350px",
          md: "400px",
        },
        height: {
          xs: "500px",
          md: "600px",
        },
        background:
          theme.palette.mode === "light"
            ? "#F8FAFE"
            : theme.palette.background.paper,
        border: `2px solid ${
          theme.palette.mode === "light" ? "#5c5c5c5c" : "#ffffffa1"
        }`,
      }}
      alignItems="center"
      justifyContent="space-between"
      gap={2}
      padding={4}
      borderRadius={5}
    >
      <Stack alignItems="center" justifyContent="start" gap={2}>
        <Avatar
          src={callToUserDetails?.to?.avatar?.url}
          alt="User Profile Image"
          sx={{
            width: "120px",
            height: "120px",
          }}
        />
        <Typography typography="body2">
          {callToUserDetails?.to?.firstName} {callToUserDetails?.to?.lastName}
        </Typography>
        <Stack
          direction="row"
          gap={2}
          alignItems="center"
          justifyContent="center"
        >
          {callToUserDetails.call_type === "Audio" ? (
            <PhoneOutgoing size={25} color="green" />
          ) : (
            <VideoCamera size={25} color="green" />
          )}
          <Typography typography="body2">
            {callToUserDetails?.call_type}
          </Typography>
        </Stack>
        <Typography typography="caption">Calling...</Typography>
      </Stack>

      <Stack alignItems="center" justifyContent="center" gap={2}>
        <IconButton
          sx={{
            background: "red",
            padding: 2,
            ":hover": {
              background: "#fe4040",
            },
          }}
          onClick={handleCutOrMissedCall}
        >
          <PhoneDisconnect size={30} color="#fff" />
        </IconButton>
      </Stack>
    </Stack>
  );
}
