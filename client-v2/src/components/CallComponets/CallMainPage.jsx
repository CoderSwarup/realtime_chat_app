import { useTheme } from "@emotion/react";
import { Box, Stack, Typography } from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import NoChat from "../../assets/Illustration/NoChat";
import DaillingDialog from "./DaillingDialog";
import VideoCallComponent from "./VideoCallComponent";
import AudioCallComponent from "./AudioCallComponent";

const NoConversation = () => {
  return (
    <Stack
      width={"100%"}
      height={"100%"}
      spacing={3}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <NoChat />
      <Typography variant="subtitle1">Start A New Conversation</Typography>
    </Stack>
  );
};

export default function CallMainPage() {
  const theme = useTheme();
  const {
    open_call_dialog,
    call_type,
    open_call_notification_dialog,
    incoming,
  } = useSelector((state) => state.audiovideocall);

  if (!open_call_dialog && call_type === null) {
    return (
      <Box
        sx={{
          height: "100%",
          width: "calc(100vw - 410px)", // if we need sidebar -720px
          background:
            theme.palette.mode == "light"
              ? "#F0F4FE"
              : theme.palette.background.default,
        }}
      >
        {" "}
        <NoConversation />
      </Box>
    );
  }

  const renderContent = () => {
    switch (call_type) {
      case "Audio":
        return <AudioCallComponent />;
      case "Video":
        return <VideoCallComponent />;
      default:
        return <NoConversation />;
    }
  };

  return (
    <Box
      sx={{
        height: "100%",
        width: "calc(100vw - 410px)", // if we need sidebar -720px
        background:
          theme.palette.mode == "light"
            ? "#F0F4FE"
            : theme.palette.background.default,
      }}
    >
      <Stack
        width={"100%"}
        height={"100%"}
        spacing={2}
        alignItems={"center"}
        justifyContent={"center"}
        position={"relative"}
      >
        {open_call_notification_dialog && incoming == false ? (
          <DaillingDialog />
        ) : (
          <>
            {open_call_dialog && call_type !== null ? (
              renderContent()
            ) : (
              <NoConversation />
            )}
          </>
        )}
      </Stack>
    </Box>
  );
}
