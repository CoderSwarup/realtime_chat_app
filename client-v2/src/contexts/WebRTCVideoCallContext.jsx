import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { socket } from "../Socket";
import Peer from "simple-peer";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { ShowSnackbar } from "../Redux/Slices/AppSlice";
import { Box } from "@mui/material";
import VideoCallComponent from "../components/CallComponets/VideoCallComponent";

const VideoCallContext = createContext();

export const useCall = () => useContext(VideoCallContext);

export const AudioVideoCallProvider = ({ children }) => {
  const dispatch = useDispatch();

  const [callLoading, setCallLoading] = useState(false);
  const [inComingCallDetails, setInComingCallDetails] = useState(null);

  const localVideoref = useRef();
  const remoteVideoref = useRef();

  const [isIncommingCall, setIsIncommingCall] = useState(false);
  const [userOnCall, setUserOnCall] = useState(false);

  const [isCallAccepted, setIsCallAccepted] = useState(false);
  const [callToUserDetails, setCallToUserDetails] = useState({
    call_id: null,
    call_type: null,
    from: null,
    to: {},
  });

  const [stream, setStream] = useState(null);
  const connectionRef = useRef();

  const currentUser_id = localStorage.getItem("user_id");
  const { userdetails } = useSelector((state) => state.auth);

  const [audioEnabled, setAudioEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [screenSharing, setScreenSharing] = useState(false);

  const startCall = async (call_type, from, to) => {
    if (userOnCall) {
      dispatch(ShowSnackbar("warning", "Your Alredy On the Call"));
      return;
    }

    if (!socket) {
      console.error("Socket is not initialized!");
      return;
    }
    if (!stream || stream.getTracks().length === 0) {
      dispatch(
        ShowSnackbar(
          "warning",
          "Something Went Wrong Please Refresh The Page!..."
        )
      );
      console.error("Stream has no active tracks or is undefined!");
      return;
    }

    console.log("Initializing Peer with stream:", stream);

    setCallLoading(true);
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      console.log("Call User With Signal", data);
      socket.emit(
        "CREATE_NEW_CALL",
        {
          call_type,
          from,
          to,
          signal: data,
        },
        (data) => {
          if (data.status) {
            setUserOnCall(true);
            setCallToUserDetails({
              call_id: data.call_id,
              call_type,
              from: from,
              to: to,
            });
          }
          setCallLoading(false);
        }
      );
    });

    peer.on("stream", (stream) => {
      console.log("Received remote stream:", stream);

      if (remoteVideoref.current) {
        remoteVideoref.current.srcObject = stream;
      }
    });

    socket.once("CALL_ACCEPT", (data) => {
      dispatch(ShowSnackbar("success", "Call is Accepted By the User"));
      console.log("CALL ACCEPT FROM THE USER ", data);

      setIsCallAccepted(true);
      setIsIncommingCall(false);
      setUserOnCall(true);
      setInComingCallDetails(data);

      peer.signal(data.signal);
    });

    connectionRef.current = peer;
  };

  const handleAcceptCall = () => {
    if (userOnCall) return;

    if (!stream || stream.getTracks().length === 0) {
      dispatch(
        ShowSnackbar(
          "warning",
          "Something Went Wrong Please Refresh The Page!..."
        )
      );
      console.error("Stream has no active tracks or is undefined!");
      return;
    }
    setIsCallAccepted(true);
    setUserOnCall(true);
    setIsIncommingCall(false);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: stream,
    });

    peer.on("signal", (data) => {
      console.log("Accept Call With Signal", data);
      socket.emit(
        "CALL_ACCEPT",
        {
          call_id: inComingCallDetails.call_id,
          signal: data,
          from: {
            _id: currentUser_id,
            ...userdetails,
          },
          to: inComingCallDetails.from,
        },
        (data) => {
          if (data.status) {
            dispatch(ShowSnackbar("success", data.message));
          } else {
            dispatch(ShowSnackbar("error", data.message));
            setInComingCallDetails(null);
          }
          setIsIncommingCall(false);
        }
      );
    });

    peer.on("stream", (stream) => {
      console.log("REMOTES STREM", stream);

      remoteVideoref.current.srcObject = stream;
    });
    console.log("CALLER SIGNAL", inComingCallDetails.signal);
    if (!inComingCallDetails.signal) return;

    peer.signal(inComingCallDetails.signal);

    connectionRef.current = peer;
  };

  const resetCallData = () => {
    setInComingCallDetails(false);
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
    }
    setStream(null);
    setIsIncommingCall(false);
    setUserOnCall(false);

    if (localVideoref.current) {
      localVideoref.current.srcObject = null;
    }

    if (remoteVideoref.current) {
      remoteVideoref.current.srcObject = null;
    }
    if (connectionRef.current) {
      connectionRef.current.destroy();
    }
  };

  const toggleAudio = () => {
    if (stream) {
      const audioTrack = stream.getAudioTracks()[0];
      if (!audioTrack) {
        console.error("No audio track found!");
        return;
      }

      // Toggle local track
      audioTrack.enabled = !audioTrack.enabled;
      setAudioEnabled(audioTrack.enabled);

      // Replace track in peer connection
      if (connectionRef.current) {
        const audioSender = connectionRef.current._pc
          .getSenders()
          .find((sender) => sender.track?.kind === "audio");

        if (audioSender) {
          audioSender
            .replaceTrack(audioTrack)
            .catch((err) => console.error("Error replacing audio track:", err));
        } else {
          console.warn("No audio sender found in peer connection!");
        }
      }
    }
  };

  const toggleVideo = () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (!videoTrack) {
        console.error("No video track found!");
        return;
      }

      // Toggle local track
      videoTrack.enabled = !videoTrack.enabled;
      setVideoEnabled(videoTrack.enabled);

      // Replace track in peer connection
      if (connectionRef.current) {
        const videoSender = connectionRef.current._pc
          .getSenders()
          .find((sender) => sender.track?.kind === "video");

        if (videoSender) {
          videoSender
            .replaceTrack(videoTrack)
            .catch((err) => console.error("Error replacing video track:", err));
        } else {
          console.warn("No video sender found in peer connection!");
        }
      }
    }
  };

  const shareScreen = async () => {
    try {
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: true,
      });

      const screenTrack = screenStream.getVideoTracks()[0];

      if (connectionRef?.current) {
        const sender = connectionRef.current._pc
          .getSenders()
          .find((s) => s.track?.kind === "video");
        if (sender) {
          sender.replaceTrack(screenTrack);
        }
      }

      if (localVideoref.current) {
        localVideoref.current.srcObject = screenStream;
      }

      setScreenSharing(true); // Update state

      screenTrack.onended = () => stopScreenShare();
    } catch (error) {
      console.error("Error sharing screen:", error);
    }
  };

  const stopScreenShare = async () => {
    if (stream) {
      const videoTrack = stream.getVideoTracks()[0];
      if (connectionRef?.current) {
        const sender = connectionRef.current._pc
          .getSenders()
          .find((s) => s.track?.kind === "video");
        if (sender) {
          sender.replaceTrack(videoTrack);
        }
      }

      if (localVideoref.current) {
        localVideoref.current.srcObject = stream;
      }
    }

    setScreenSharing(false); // Update state
  };

  useEffect(() => {
    socket?.on("user_offline", (data) => {
      console.log("USER OFFLINE", inComingCallDetails, data);
      console.log(inComingCallDetails?.from?._id === data.user);

      if (
        inComingCallDetails?.from?._id === data.user ||
        inComingCallDetails?.to?._id === data.user
      ) {
        dispatch(ShowSnackbar("success", "User is Offline"));
        resetCallData();
      }
    });

    return () => {
      socket?.off("user_offline");
    };
  }, [socket, inComingCallDetails]);

  useEffect(() => {
    setCallLoading(true);
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream);

        if (localVideoref.current) {
          localVideoref.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Error accessing media devices:", err);
        dispatch(ShowSnackbar("error", "Error accessing media devices!..."));
      })
      .finally(() => {
        setCallLoading(false);
      });

    return () => {
      stream?.getTracks().forEach((track) => track.stop());
    };
  }, [userOnCall]);
  return (
    <VideoCallContext.Provider
      value={{
        startCall,
        remoteVideoref,
        localVideoref,
        inComingCallDetails,
        setInComingCallDetails,
        stream,
        setStream,
        isIncommingCall,
        setIsIncommingCall,
        userOnCall,
        setUserOnCall,
        resetCallData,
        isCallAccepted,
        setIsCallAccepted,
        callToUserDetails,
        setCallToUserDetails,
        handleAcceptCall,
        callLoading,
        setCallLoading,
        audioEnabled,
        setAudioEnabled,
        videoEnabled,
        setVideoEnabled,
        toggleAudio,
        toggleVideo,
        screenSharing,
        shareScreen,
        stopScreenShare,
      }}
    >
      {children}

      <Box
        sx={{
          height: "100vh",
          width: "100vw",
          display: `${userOnCall && isCallAccepted ? "flex" : "none"}`,
          justifyContent: "center",
          alignItems: "center",
          color: "white",
          position: "absolute",
          zIndex: 99,
          top: 0,
          right: 0,
        }}
      >
        <VideoCallComponent />
      </Box>
    </VideoCallContext.Provider>
  );
};
