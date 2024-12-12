import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Slide,
  Button,
  Typography,
  IconButton,
  Box,
  Avatar,
  Divider,
} from "@mui/material";
import {
  PhoneCall,
  X,
  PhoneIncoming,
  Phone,
  PhoneDisconnect,
} from "phosphor-react";
import { socket } from "../../Socket";
import { ShowSnackbar } from "../../Redux/Slices/AppSlice";
import { useNavigate } from "react-router-dom";
import { useCall } from "../../contexts/WebRTCVideoCallContext";
import { useDispatch } from "react-redux";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function IncomingCallDialog() {
  const navigator = useNavigate();
  const dispatch = useDispatch();
  const {
    inComingCallDetails,
    setInComingCallDetails,
    isIncommingCall,
    setIsIncommingCall,
    resetCallData,
    handleAcceptCall,
  } = useCall();

  const handleCallDenied = () => {
    socket.emit(
      "CALL_DENIED",
      {
        call_id: inComingCallDetails.call_id,
        from: inComingCallDetails.to,
        to: inComingCallDetails.from,
        call_type: inComingCallDetails.call_type,
      },
      (data) => {
        if (data.status) {
          dispatch(ShowSnackbar("success", data.message));
        } else {
          dispatch(ShowSnackbar("error", data.message));
        }
        resetCallData();
      }
    );
  };

  // const handleCallAccept = () => {
  //   socket.emit(
  //     "CALL_ACCEPT",
  //     {
  //       call_id: inComingCallDetails.call_id,
  //       from: inComingCallDetails.to,
  //       to: inComingCallDetails.from,
  //       call_type: inComingCallDetails.call_type,
  //     },
  //     (data) => {
  //       if (data.status) {
  //         dispatch(ShowSnackbar("success", data.message));
  //         navigator("/call");
  //       } else {
  //         dispatch(ShowSnackbar("error", data.message));
  //         setInComingCallDetails(null); // Clear call details on failure
  //       }
  //       handleClose();
  //     }
  //   );
  // };

  return (
    <Dialog
      open={isIncommingCall}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => {}}
      aria-labelledby="incoming-call-dialog"
      PaperProps={{
        sx: {
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "80%",
          borderRadius: 2,
          p: 2,
          overflow: "hidden",
        },
      }}
    >
      <DialogContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Incoming Call</Typography>
          <IconButton
            onClick={() => {
              setInComingCallDetails(null);
              setIsIncommingCall(false);
            }}
          >
            <X size={24} />
          </IconButton>
        </Box>
        <Box display="flex" alignItems="center" my={4} gap={2}>
          <Avatar
            alt="Caller Avatar"
            src={inComingCallDetails?.from?.avatar?.url}
            sx={{ width: 56, height: 56 }}
          />
          <Divider orientation="vertical" variant="middle" flexItem />
          <Box>
            <Typography variant="subtitle1">
              {inComingCallDetails?.from?.firstName}{" "}
              {inComingCallDetails?.from?.lastName}
            </Typography>
            <Typography variant="body2">
              {inComingCallDetails?.from?.email}
            </Typography>
            <Typography variant="caption">
              {inComingCallDetails?.call_type} Calling...
            </Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions sx={{ justifyContent: "space-around" }}>
        <Button
          onClick={handleCallDenied}
          color="primary"
          variant="contained"
          sx={{
            backgroundColor: "red",
            ":hover": {
              backgroundColor: "red",
            },
          }}
          startIcon={<PhoneDisconnect size={24} />}
        >
          Decline
        </Button>
        <Button
          onClick={() => {
            handleAcceptCall();
          }}
          color="primary"
          variant="contained"
          sx={{ backgroundColor: "green" }}
          startIcon={<PhoneIncoming size={24} />}
        >
          Answer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
