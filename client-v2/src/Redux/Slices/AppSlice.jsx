import { createSlice } from "@reduxjs/toolkit";
// import { dispatch } from "../store";

const initialState = {
  sidebar: {
    open: false,
    type: "CONTACT", // CONTACT , STARMSG , MEDIA
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
