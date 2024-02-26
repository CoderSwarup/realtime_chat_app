import { createSlice } from "@reduxjs/toolkit";
// import { dispatch } from "../store";

const initialState = {
  sidebar: {
    open: false,
    type: "CONTACT", // CONTACT , STARMSG , MEDIA
  },
  snackbar: {
    open: false,
    message: null,
    severity: null,
  },
};

const AppSlice = createSlice({
  name: "app",
  initialState,
  reducers: {
    // toggle side Bar
    toggleSideBar(state, actions) {
      console.log(state);
      state.sidebar.open = !state.sidebar.open;
    },

    //Updtate SideBar Type
    updateSideBarType(state, actions) {
      state.sidebar.type = actions.payload.type;
    },

    //open snakbar
    openSnackbar(state, action) {
      state.snackbar.open = true;
      state.snackbar.severity = action.payload.severity;
      state.snackbar.message = action.payload.message;
    },

    //close snakbar
    closeSnackbar(state, action) {
      state.snackbar.open = false;
      state.snackbar.severity = null;
      state.snackbar.message = null;
    },
  },
});

// Export Reducer
export default AppSlice.reducer;

//Toggle Reducer
export const ToggleSideBar = () => {
  return async (dispatch, getState) => {
    dispatch(AppSlice.actions.toggleSideBar());
  };
};

export const UpdateSidebarType = (type) => {
  return async (dispatch, getState) => {
    dispatch(AppSlice.actions.updateSideBarType({ type }));
  };
};

export const ShowSnackbar = (severity, message) => {
  return async function (dispatch, getState) {
    dispatch(AppSlice.actions.openSnackbar({ severity, message }));

    await setTimeout(() => {
      dispatch(AppSlice.actions.closeSnackbar());
    }, 5000);
  };
};

export const HideSnackBar = () => {
  return async function (dispatch, getState) {
    dispatch(AppSlice.actions.closeSnackbar());
  };
};
