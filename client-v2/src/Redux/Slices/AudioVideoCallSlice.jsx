import { createSlice } from "@reduxjs/toolkit";
import { socket } from "../../Socket";
import { ShowSnackbar } from "./AppSlice";
import AxiosInstance from "../../utils/Axios";

const initialState = {
  open_call_dialog: false,
  open_call_notification_dialog: false,
  call_queue: [], // can have max 1 call at any point of time
  incoming: false,
  call_type: null,
  caller_details: null,
  call_logs: [],
};

const AudioVideoCallSlice = createSlice({
  name: "audiovideocall",
  initialState,
  reducers: {
    pushToCallQueue(state, action) {
      // check video_call_queue in redux store
      if (state.call_queue.length === 0) {
        state.call_queue.push(action.payload.call);
        if (action.payload.incoming) {
          state.open_call_notification_dialog = true; // this will open up the call dialog
          state.incoming = true;
          state.call_type = action.payload.call_type;
          state.caller_details = action.payload.from;
        } else {
          state.open_call_notification_dialog = true;
          state.incoming = false;
          state.call_type = action.payload.call_type;
          state.caller_details = action.payload.to;
        }
      } else {
        socket.emit("user_is_busy_video_call", { ...action.payload });
      }

      // Ideally queue should be managed on server side
    },
    resetCallQueue(state, action) {
      state.call_queue = [];
      state.open_call_notification_dialog = false;
      state.incoming = false;
      state.caller_details = null;
      state.open_call_dialog = false;
      state.call_type = null;
    },
    closeNotificationDialog(state, action) {
      state.open_call_notification_dialog = false;
    },
    updateCallDialog(state, action) {
      state.open_call_dialog = action.payload.open_call_dialog;
    },
    setCallLogs(state, action) {
      state.call_logs = action.payload.call_logs;
    },
  },
});

// Reducer
export default AudioVideoCallSlice.reducer;

// ----------------------------------------------------------------------

export const StartCall = (call_type, from, to) => {
  return async (dispatch, getState) => {
    if (getState().audiovideocall.call_queue.length > 0) {
      dispatch(ShowSnackbar("warning", "Your Already on the Call"));
    } else {
      socket.emit("CREATE_NEW_CALL", { call_type, from, to }, (data) => {
        if (data.status) {
          dispatch(ShowSnackbar("success", data.message));
          dispatch(
            AudioVideoCallSlice.actions.pushToCallQueue({
              call: { call_id: data.call_id, from, to, call_type },
              incoming: false,
              call_type: call_type,
              from,
              to,
            })
          );
        } else {
          dispatch(ShowSnackbar("error", data.message));
        }
      });
    }
  };
};

export const handleIncommingCall = (data) => {
  return async (dispatch, getState) => {
    const { call_id, from, to, call_type, call_details } = data;
    if (getState().audiovideocall.call_queue.length > 0) {
      socket.emit(
        "BUSY_CALL",
        { call_id, from: to, to: from, call_type },
        (response) => {}
      );
    } else {
      dispatch(
        AudioVideoCallSlice.actions.pushToCallQueue({
          call: {
            call_id,
            from,
            to,
            call_details,
            call_type,
          },
          incoming: true,
          call_type: call_type,
          from,
          to,
        })
      );
    }
  };
};

export const ResetCallQueue = () => {
  return async (dispatch, getState) => {
    dispatch(AudioVideoCallSlice.actions.resetCallQueue());
  };
};

export const fetchCallLogs = () => {
  return async (dispatch, getState) => {
    const token = getState().auth?.token;
    if (!token) {
      dispatch(ShowSnackbar("error", "Something Wrong !!!"));
      return;
    }

    try {
      const res = await AxiosInstance.get(
        "/call/get-call-logs",

        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (res?.data?.status) {
        dispatch(
          AudioVideoCallSlice.actions.setCallLogs({
            call_logs: res.data.call_logs,
          })
        );
      } else {
        dispatch(
          AudioVideoCallSlice.actions.setCallLogs({
            call_logs: [],
          })
        );
      }
    } catch (err) {
      console.error("Error in API call:", err);
      dispatch(
        AudioVideoCallSlice.actions.setCallLogs({
          call_logs: [],
        })
      );
    }
  };
};

export const CloseCallNotificationDialog = () => {
  return async (dispatch, getState) => {
    dispatch(AudioVideoCallSlice.actions.closeNotificationDialog());
  };
};

export const HandleOpenCallDialog = (open_call_dialog) => {
  return async (dispatch, getState) => {
    dispatch(
      AudioVideoCallSlice.actions.updateCallDialog({ open_call_dialog })
    );
  };
};
