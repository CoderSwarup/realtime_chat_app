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
import { useDispatch, useSelector } from "react-redux";
import { socket } from "../../Socket";
import { ShowSnackbar } from "../../Redux/Slices/AppSlice";
import {
  CloseCallNotificationDialog,
  HandleOpenCallDialog,
  ResetCallQueue,
} from "../../Redux/Slices/AudioVideoCallSlice";
import { useNavigate } from "react-router-dom";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function IncomingCallDialog() {
  const [open, setOpen] = useState(true);
  const navigator = useNavigate();
  const { caller_details, call_type, call_queue } = useSelector(
    (state) => state.audiovideocall
  );
  const dispatch = useDispatch();
  const handleClose = () => {
    setOpen(false);
  };

  const handleCallDenied = () => {
    socket.emit(
      "CALL_DENIED",
      {
        call_id: call_queue[0].call_id,
        from: call_queue[0].to,
        to: call_queue[0].from,
        call_type: call_queue[0].call_type,
      },
      (data) => {
        if (data.status) {
          dispatch(ShowSnackbar("success", data.message));
        } else {
          dispatch(ShowSnackbar("error", data.message));
        }
        dispatch(ResetCallQueue());
        handleClose();
      }
    );
  };

  const handleCallAccept = () => {
    socket.emit(
      "CALL_ACCEPT",
      {
        call_id: call_queue[0].call_id,
        from: call_queue[0].to,
        to: call_queue[0].from,
        call_type: call_queue[0].call_type,
      },
      (data) => {
        if (data.status) {
          dispatch(ShowSnackbar("success", data.message));
          dispatch(CloseCallNotificationDialog());
          dispatch(HandleOpenCallDialog(true));
          navigator("/call");
        } else {
          dispatch(ShowSnackbar("error", data.message));
          dispatch(ResetCallQueue());
        }

        handleClose();
      }
    );
  };

  return (
    <Dialog
      open={open}
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
          overflow: "hidden", // Prevent scrolling
        },
      }}
    >
      <DialogContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">Incoming Call</Typography>
          <IconButton onClick={handleClose}>
            <X size={24} />
          </IconButton>
        </Box>
        <Box display="flex" alignItems="center" my={4} gap={2}>
          <Avatar
            alt="Caller Avatar"
            src={caller_details?.avatar?.url}
            sx={{ width: 56, height: 56 }}
          />
          <Divider orientation="vertical" variant="middle" flexItem />
          <Box>
            <Typography variant="subtitle1">
              {caller_details.firstName + caller_details.lastName}
            </Typography>
            <Typography variant="body2">{caller_details.email}</Typography>
            <Typography variant="caption">{call_type} Calling...</Typography>
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
          onClick={handleCallAccept}
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
