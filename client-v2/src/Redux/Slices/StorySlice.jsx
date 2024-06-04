import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  sidebarIndex: 0,
  isStorySelected: false,
  stories: [],
  selectedStory: {},
  selectedStoryId: null,
  selectedStory: {},
  storyViewSidebar: false,
  yourStories: [],
};
const StorySlice = createSlice({
  name: "story",
  initialState,
  reducers: {
    //set SelectedStory
    setSelectedStory(state, action) {
      state.selectedStoryId = action.payload.selectedStoryId;
      state.selectedStory = action.payload.selectedStory;
    },

    setStorySidebarIndex(state, action) {
      state.sidebarIndex = action.payload.index;
    },

    // toggle the story
    toggleSelectStory(state, action) {
      state.isStorySelected = action.payload.isSelect;
    },
    // toggle View sidebar
    StoryViewsSidebarToggle(state, action) {
      state.storyViewSidebar = action.payload.isopen;
    },

    // set The Stories
    setStories(state, action) {
      state.stories = action.payload.stories;
    },
  },
});

export default StorySlice.reducer;

export const setStorySidebarIndex = (index) => {
  return async (dispatch, getstate) => {
    dispatch(StorySlice.actions.setStorySidebarIndex({ index }));
  };
};

export const ToggleStory = (isSelect) => {
  return async (dispatch, getstate) => {
    dispatch(StorySlice.actions.toggleSelectStory({ isSelect }));
  };
};
export const ToggleViewSideBar = (isopen) => {
  return async (dispatch, getstate) => {
    dispatch(StorySlice.actions.StoryViewsSidebarToggle({ isopen }));
  };
};

export const SetTheStories = (stories) => {
  return async (dispatch, getState) => {
    dispatch(StorySlice.actions.setStories({ stories }));
  };
};

export const setSelectStory = (selectedStoryId, selectedStory) => {
  return async (dispatch, getState) => {
    dispatch(
      StorySlice.actions.setSelectedStory({ selectedStoryId, selectedStory })
    );
  };
};
