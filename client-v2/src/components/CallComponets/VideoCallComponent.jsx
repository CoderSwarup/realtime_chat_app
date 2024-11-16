import React, { useEffect, useRef } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { Microphone, PhoneDisconnect, VideoCamera } from "phosphor-react";
import { useTheme } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../Socket";
import { ShowSnackbar } from "../../Redux/Slices/AppSlice";
import { ResetCallQueue } from "../../Redux/Slices/AudioVideoCallSlice";
import { useCall } from "../../contexts/WebRTCVideoCallContext";

const ControlButton = styled(IconButton)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  padding: theme.spacing(2.5),
  "&:hover": {
    backgroundColor: theme.palette.primary.main,
  },
  "&.leave-btn": {
    backgroundColor: "rgba(255, 80, 80, 1)",
    "&:hover": {
      backgroundColor: "rgba(255, 80, 80, 1)",
    },
  },
}));

export default function VideoCallComponent() {
  const {
    localVideoref,
    remoteVideoref,
    endCall,
    setLocalStream,
    localStream,
  } = useCall();
  const theme = useTheme();
  const dispatch = useDispatch();
  const { call_queue, caller_details } = useSelector(
    (state) => state.audiovideocall
  );
  const user_id = localStorage.getItem("user_id");
  const { userdetails } = useSelector((state) => state.auth);

  const handleCallDisconnect = () => {
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
      setLocalStream(null);
    }

    const { call_id, call_type, from, to } = call_queue[0];

    socket.emit(
      "CUT_CALL",
      {
        call_id,
        call_type,
        to: caller_details,
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
        dispatch(ResetCallQueue());
      }
    );
  };

  useEffect(() => {
    async function getMediaStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });
        setLocalStream(stream);
        if (localVideoref.current) {
          localVideoref.current.srcObject = stream;
        }
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    }

    getMediaStream();
  }, []);
  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        overflow: "hidden",
        position: "relative",
      }}
    >
      {" "}
      <Box
        id="user-1"
        width={"100%"}
        height={"100%"}
        sx={{
          objectFit: "cover",
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
          USER
        </Typography>
      </Box>
      <Box
        id="user-2"
        sx={{
          position: "absolute",
          top: "20px",
          left: "20px",
          height: "170px",
          width: "300px",
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
        <ControlButton>
          <VideoCamera color="#fff" />
        </ControlButton>
        <ControlButton>
          <Microphone color="#fff" />
        </ControlButton>
        <ControlButton onClick={handleCallDisconnect} className="leave-btn">
          <PhoneDisconnect color="#fff" />
        </ControlButton>
      </Box>
    </Box>
  );
}
