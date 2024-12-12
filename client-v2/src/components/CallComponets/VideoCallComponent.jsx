import React, { useEffect, useRef } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/system";
import {
  Microphone,
  MicrophoneSlash,
  PhoneDisconnect,
  Prohibit,
  Screencast,
  VideoCamera,
  VideoCameraSlash,
} from "phosphor-react";
import { useTheme } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../Socket";
import { ShowSnackbar } from "../../Redux/Slices/AppSlice";
import { useCall } from "../../contexts/WebRTCVideoCallContext";

const ControlButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(0.4),
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
  },
  "&.leave-btn": {
    backgroundColor: "rgba(255, 80, 80, 1)",
    "&:hover": {
      backgroundColor: "rgba(255, 80, 80, 1)",
    },
  },
  width: "40px",
  height: "40px",
}));

export default function VideoCallComponent() {
  const {
    localVideoref,
    remoteVideoref,
    inComingCallDetails,
    resetCallData,
    audioEnabled,
    videoEnabled,
    toggleAudio,
    toggleVideo,
    screenSharing,
    shareScreen,
    stopScreenShare,
  } = useCall();
  const theme = useTheme();
  const dispatch = useDispatch();

  const user_id = localStorage.getItem("user_id");
  const { userdetails } = useSelector((state) => state.auth);

  const handleCallDisconnect = () => {
    const { call_id, call_type, from, to } = inComingCallDetails;
    console.log(inComingCallDetails);

    socket.emit(
      "CUT_CALL",
      {
        call_id,
        call_type,
        to: from,
        from: {
          _id: user_id,
          ...userdetails,
        },
      },
      (data) => {
        if (data.status) {
          dispatch(ShowSnackbar("success", "Call Disconnect successfully"));
        } else {
          dispatch(ShowSnackbar("error", data.message));
        }
        resetCallData();
      }
    );
  };

  return (
    <Box
      sx={{
        height: {
          xs: "100%",
          sm: "600px",
        },
        width: {
          xs: "100%",
          sm: "500px",
        },
        overflow: "hidden",
        position: "relative",
        border: 2,
        borderColor: "blue",
        background: "#1c1c1c",
      }}
    >
      {" "}
      <Box
        id="user-1"
        sx={{
          width: "100%",
          height: "100%",
          margin: 0,
          padding: 0,
        }}
      >
        <video
          ref={remoteVideoref}
          autoPlay
          playsInline
          loop
          width={"100%"}
          height={"100%"}
          style={{ objectFit: "cover", margin: 0, padding: 0 }}
        ></video>
        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            top: "10px",
            right: "20px",
            color: "white",
            background: theme.palette.primary.main,
            backdropFilter: "blur(10px)",
            borderRadius: "10px",
            padding: "5px 10px",
          }}
        >
          {inComingCallDetails && inComingCallDetails?.from
            ? `${inComingCallDetails?.from?.firstName} ${inComingCallDetails?.from?.lastName}`
            : "USER"}
        </Typography>
      </Box>
      <Box
        id="user-2"
        sx={{
          position: "absolute",
          top: "20px",
          left: "20px",
          height: "200px",
          width: "150px",
          borderRadius: "5px",
          border: `2px solid ${theme.palette.primary.main}`,
          boxShadow: "3px 3px 15px -1px rgba(0, 0, 0, 0.77)",
          zIndex: 999,
          background: "#000",
          margin: 0,
          padding: 0,
        }}
      >
        {" "}
        <video
          ref={localVideoref}
          playsInline
          autoPlay
          muted
          width={"100%"}
          height={"100%"}
          style={{ objectFit: "cover", margin: 0, padding: 0 }}
        ></video>
        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            top: "10px",
            right: "10px",
            color: "white",
            background: theme.palette.primary.main,
            backdropFilter: "blur(10px)",
            borderRadius: "10px",
            padding: "5px 10px",
          }}
        >
          YOU
        </Typography>
      </Box>
      <Box
        sx={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          display: "flex",
          gap: "1em",
        }}
      >
        <ControlButton onClick={toggleVideo}>
          {videoEnabled ? (
            <VideoCamera color="#fff" size={20} />
          ) : (
            <VideoCameraSlash color="#fff" />
          )}
        </ControlButton>
        <ControlButton onClick={toggleAudio}>
          {audioEnabled ? (
            <Microphone color="#fff" />
          ) : (
            <MicrophoneSlash color="#fff" />
          )}
        </ControlButton>
        {screenSharing ? (
          <ControlButton onClick={stopScreenShare}>
            <Prohibit color="#fff" />
          </ControlButton>
        ) : (
          <ControlButton onClick={shareScreen}>
            <Screencast color="#fff" />
          </ControlButton>
        )}
        <ControlButton onClick={handleCallDisconnect} className="leave-btn">
          <PhoneDisconnect color="#fff" />
        </ControlButton>
      </Box>
    </Box>
  );
}
