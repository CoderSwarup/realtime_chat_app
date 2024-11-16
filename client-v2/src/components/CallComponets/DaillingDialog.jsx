import { faker } from "@faker-js/faker";
import { Avatar, IconButton, Stack, Typography, useTheme } from "@mui/material";
import {
  DeviceMobile,
  PhoneCall,
  PhoneDisconnect,
  PhoneOutgoing,
  VideoCamera,
} from "phosphor-react";
import { useDispatch, useSelector } from "react-redux";
import { ResetCallQueue } from "../../Redux/Slices/AudioVideoCallSlice";
import { socket } from "../../Socket";

export default function DaillingDialog() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { call_type, caller_details, incoming, call_queue } = useSelector(
    (state) => state.audiovideocall
  );

  const handleCutOrMissedCall = () => {
    const { call_id, from, to, call_type } = call_queue[0];
    socket.emit("MISSED_CALL", { call_id, from, to, call_type }, (data) => {
      if (data.status) {
        dispatch(ShowSnackbar("success", data.message));
      } else {
        dispatch(ShowSnackbar("error", data.message));
      }
      dispatch(ResetCallQueue());
      handleClose();
    });
    dispatch(ResetCallQueue());
  };
  return (
    <Stack
      sx={{
        width: "400px",
        height: "600px",
        background:
          theme.palette.mode == "light"
            ? "#F8FAFE"
            : theme.palette.background.paper,
        border: `2px solid ${
          theme.palette.mode == "light" ? "#5c5c5c5c" : "#ffffffa1"
        } `,
      }}
      alignItems={"center"}
      justifyContent={"space-between"}
      gap={2}
      padding={4}
      borderRadius={5}
    >
      <Stack alignItems={"center"} justifyContent={"start"} gap={2}>
        <Avatar
          src={caller_details?.avatar?.url}
          alt="User Profile Image"
          sx={{
            width: "120px",
            height: "120px",
          }}
        ></Avatar>
        <Typography typography={"body2"}>
          {caller_details.firstName + caller_details.lastName}
        </Typography>
        <Stack
          direction={"row"}
          gap={2}
          alignItems={"center"}
          justifyContent={"center"}
        >
          {" "}
          {call_type === "Audio" ? (
            <PhoneOutgoing size={25} color="green" />
          ) : (
            <VideoCamera size={25} color="green" />
          )}{" "}
          <Typography typography={"body2"}>{call_type}</Typography>
        </Stack>
        <Typography typography={"caption"}>Calling.....</Typography>
      </Stack>
      <Stack alignItems={"center"} justifyContent={"center"} gap={2}>
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
