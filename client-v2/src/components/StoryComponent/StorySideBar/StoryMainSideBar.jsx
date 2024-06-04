import { IconButton, Menu, MenuItem, Stack, Typography } from "@mui/material";
import { UploadSimple } from "phosphor-react";
import React, { useState } from "react";
import StoryElement from "../StoryElement";
import { useTheme } from "@emotion/react";
import { STORY_UPLOAD_TYPE, StoryMenu } from "../../../data";
import { setStorySidebarIndex } from "../../../Redux/Slices/StorySlice";
import { useDispatch, useSelector } from "react-redux";
import { useFetchUserStories } from "../../../GraphQl/StoriesService/apis/query_api";
import LoadingScreen from "../../LoadingScreen";

export default function StoryMainSideBar() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const { stories: storiesData, selectedStory } = useSelector(
    (state) => state.story
  );

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  // fetch the Stories
  const { loading, error, stories } = useFetchUserStories();

  if (loading) {
    return <LoadingScreen />;
  }
  return (
    <Stack position={"relative"} p={3} sx={{ height: "100vh" }} spacing={3}>
      <Stack
        position={"relative"}
        width={"100%"}
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        {" "}
        <Typography variant="h5">Story</Typography>
        <IconButton id="story-upload-menu" onClick={handleClick}>
          <UploadSimple />
        </IconButton>
      </Stack>
      <Menu
        id="story-upload-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
        anchorOrigin={{
          vertical: "center",
          horizontal: "",
        }}
      >
        <Stack spacing={1} p={0.5}>
          {STORY_UPLOAD_TYPE.map((ele, i) => {
            return (
              <MenuItem key={i} onClick={handleClose}>
                <Stack
                  onClick={() => {
                    dispatch(setStorySidebarIndex(ele.id));
                  }}
                  sx={{ width: 80 }}
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                >
                  <span>{ele.title}</span>
                </Stack>
              </MenuItem>
            );
          })}
        </Stack>
      </Menu>

      <StoryElement
        isSeen={false}
        isMyStory={true}
        storyData={{ stories: selectedStory?.stories }}
      />

      <Typography typography={"body2"} color={theme.palette.primary.main}>
        {" "}
        Others Story
      </Typography>

      <Stack
        spacing={3}
        className="hideScrollBar"
        direction="column"
        sx={{ flexGrow: 1, overflowY: "scroll", height: "100%" }}
      >
        {storiesData.length > 0 &&
          storiesData.map((story) => {
            return (
              <StoryElement
                storyData={story}
                isSeen={false}
                isMyStory={false}
              />
            );
          })}
      </Stack>
    </Stack>
  );
}
