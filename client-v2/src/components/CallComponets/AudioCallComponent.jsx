import React, { useEffect, useRef } from "react";
import { Box, IconButton, Typography } from "@mui/material";
import { styled } from "@mui/system";
import { Microphone, PhoneDisconnect } from "phosphor-react";
import { useTheme } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../Socket";
import { ResetCallQueue } from "../../Redux/Slices/AudioVideoCallSlice";
import { ShowSnackbar } from "../../Redux/Slices/AppSlice";

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

export default function AudioCallComponent() {
  const otherAudioRef = useRef(null);
  const canvasRef = useRef(null);
  const theme = useTheme();
  const dispatch = useDispatch();
  const { call_queue, caller_details } = useSelector(
    (state) => state.audiovideocall
  );
  const user_id = localStorage.getItem("user_id");
  const { userdetails } = useSelector((state) => state.auth);

  useEffect(() => {
    async function getMediaStream() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
        });
        if (otherAudioRef.current) {
          otherAudioRef.current.srcObject = stream;
        }

        const audioContext = new (window.AudioContext ||
          window.webkitAudioContext)();
        const source = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        source.connect(analyser);

        function draw() {
          requestAnimationFrame(draw);
          analyser.getByteFrequencyData(dataArray);
          const canvas = canvasRef.current;
          const canvasCtx = canvas?.getContext("2d");
          const width = canvas.width;
          const height = canvas.height;
          canvasCtx.clearRect(0, 0, width, height);

          const barWidth = (width / bufferLength) * 2.5;
          let barHeight;
          let x = 0;

          for (let i = 0; i < bufferLength; i++) {
            barHeight = dataArray[i];
            canvasCtx.fillStyle = "rgba(255, 255, 255, 0.7)";
            canvasCtx.fillRect(
              x,
              height - barHeight / 2,
              barWidth,
              barHeight / 2
            );
            x += barWidth + 1;
          }
        }

        draw();
      } catch (error) {
        console.error("Error accessing media devices.", error);
      }
    }

    getMediaStream();
  }, []);

  const handleCallDisconnect = () => {
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

  return (
    <Box
      sx={{
        height: "100vh",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        position: "relative",
      }}
    >
      {" "}
      <Box
        sx={{
          width: "150px",
          height: "150px",
          borderRadius: "50%",
          background: "rgba(255, 255, 255, 0.2)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          backdropFilter: "blur(10px)",
          marginBottom: "20px",
          position: "relative",
        }}
      >
        {" "}
        <Typography variant="h6" sx={{ color: "white" }}>
          {caller_details.firstName + " " + caller_details.lastName}
        </Typography>
        <canvas
          ref={canvasRef}
          width="150"
          height="150"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            borderRadius: "50%",
          }}
        />
      </Box>
      <Typography
        variant="caption"
        sx={{
          my: 2,
        }}
      >
        {caller_details.email}
      </Typography>
      <Typography
        variant="caption"
        sx={{
          background: "rgba(0, 0, 0, 0.6)",
          padding: "5px 10px",
          borderRadius: "10px",
          backdropFilter: "blur(10px)",
        }}
      >
        On Audio Call...
      </Typography>
      <audio
        ref={otherAudioRef}
        autoPlay
        playsInline
        style={{ display: "none" }}
      ></audio>
      <Box
        sx={{
          position: "absolute",
          bottom: "20px",
          display: "flex",
          gap: "1em",
        }}
      >
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
