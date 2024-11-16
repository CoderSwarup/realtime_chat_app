import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from "react";
import { socket } from "../Socket";

const VideoCallContext = createContext();

export const useCall = () => useContext(VideoCallContext);

export const AudioVideoCallProvider = ({ children }) => {
  const [localStream, setLocalStream] = useState(null);
  const [peerConnection, setPeerConnection] = useState(null);
  const localVideoref = useRef();
  const remoteVideoref = useRef();
  const currentUser = localStorage.getItem("user_id");

  const createPeerConnection = () => {
    const config = {
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    };
    const pc = new RTCPeerConnection(config);

    if (localStream) {
      localStream.getTracks().forEach((track) => {
        pc.addTrack(track, localStream);
      });
    }

    pc.ontrack = (event) => {
      if (remoteVideoref.current) {
        remoteVideoref.current.srcObject = event.streams[0];
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.emit("ICECANDIDATE", event.candidate);
      }
    };

    return pc;
  };

  const startCall = async (user) => {
    const pc = createPeerConnection();
    setPeerConnection(pc);
    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);
    socket.emit("VIDEO_OFFER", {
      from: currentUser,
      to: user,
      offer: pc.localDescription,
    });
  };

  const endCall = () => {
    if (peerConnection) {
      peerConnection.close();
      setPeerConnection(null);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("VIDEO_OFFER", async ({ from, to, offer }) => {
        if (peerConnection) {
          await peerConnection.setRemoteDescription(offer);
          const answer = await peerConnection.createAnswer();
          await peerConnection.setLocalDescription(answer);
          socket.emit("VIDEO_ANSWER", {
            from,
            to,
            answer: peerConnection.localDescription,
          });
        } else {
          const pc = createPeerConnection();
          setPeerConnection(pc);
          await pc.setRemoteDescription(offer);
          const answer = await pc.createAnswer();
          await pc.setLocalDescription(answer);
          socket.emit("VIDEO_ANSWER", {
            from,
            to,
            answer: pc.localDescription,
          });
        }
      });

      //   socket.on("VIDEO_ANSWER", async ({ from, to, answer }) => {
      //     if (!peerConnection) {
      //       const pc = createPeerConnection();
      //       setPeerConnection(pc);
      //     }
      //     await peerConnection.setRemoteDescription(answer);
      //   });
      socket.on("VIDEO_ANSWER", async ({ from, to, answer }) => {
        if (peerConnection) {
          const signalingState = peerConnection.signalingState;
          if (
            signalingState === "have-local-offer" ||
            signalingState === "stable"
          ) {
            await peerConnection.setRemoteDescription(answer);
          } else {
            console.warn(`Unexpected signaling state: ${signalingState}`);
          }
        }
      });
      socket.on("ICECANDIDATE", async (candidate) => {
        if (peerConnection) {
          await peerConnection.addIceCandidate(new RTCIceCandidate(candidate));
        }
      });

      socket.on("end-call", () => {
        endCall();
      });

      socket.on("call-ended", () => {
        endCall();
      });
    }
  }, [socket, peerConnection, localStream]);

  return (
    <VideoCallContext.Provider
      value={{
        localStream,
        startCall,
        endCall,
        remoteVideoref,
        localVideoref,
        setLocalStream,
      }}
    >
      {children}
    </VideoCallContext.Provider>
  );
};
