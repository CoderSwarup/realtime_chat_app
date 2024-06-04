import { useTheme } from "@emotion/react";
import { Avatar, Box, Stack, Typography } from "@mui/material";
import React from "react";
import { ToggleStory, setSelectStory } from "../../Redux/Slices/StorySlice";
import { useDispatch, useSelector } from "react-redux";
import { formatTime, isToday } from "../../utils/Time";
import { useFetchMystories } from "../../GraphQl/StoriesService/apis/query_api";
const userId = localStorage.getItem("user_id");
export default function StoryElement({ storyData, isMyStory = false, isSeen }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const { stories: MyStories } = useFetchMystories();
  const Name = storyData?.user?.name;
  const { userdetails } = useSelector((state) => state.auth);

  const date = new Date(
    storyData?.stories?.length > 0
      ? storyData?.stories[storyData.stories?.length - 1]?.updatedAt
      : 0
  );
  const displayTime = isToday(date)
    ? `Today ${formatTime(date)}`
    : date.toDateString();

  const handleSelectStory = () => {
    if (isMyStory) {
      dispatch(setSelectStory(userId, MyStories[0]));
    } else {
      dispatch(setSelectStory(storyData?.user.id, storyData));
    }
  };
  return (
    <Box
      sx={{
        width: "100%",
        cursor: "pointer",
        borderRadius: 1,
        height: 60,
        transition: ".2s ease",
        ":hover": {
          background: theme.palette.background.neutral,
        },
        p: 1,
      }}
    >
      <Stack
        width={"100%"}
        direction="row"
        alignItems="center"
        justifyContent="start"
        gap={1}
        onClick={() => {
          dispatch(ToggleStory(true));
          handleSelectStory();
        }}
      >
        {isSeen ? (
          <Avatar
            src={isMyStory ? userdetails?.avatar : storyData?.user?.avatar}
            alt="fdfdfdf"
          ></Avatar>
        ) : (
          <Box
            padding={"2px"}
            borderRadius={"100%"}
            border={`2px solid ${theme.palette.primary.name}`}
          >
            <Avatar
              src={isMyStory ? userdetails?.avatar : storyData?.user?.avatar}
              alt="fdfdfdf"
            ></Avatar>
          </Box>
        )}
        <Stack
          sx={{
            width: "100%",
            borderTop: isMyStory ? "none" : "1px solid #6f6f6f74",
            paddingTop: !isMyStory && 1,
          }}
        >
          <Typography variant="body2">
            {" "}
            {isMyStory ? "MY STORY" : Name}
          </Typography>
          <Typography variant="caption">
            {!isMyStory
              ? storyData?.stories?.length > 0
                ? displayTime
                : "STORY NOT UPLODED"
              : "YOUR STORIES"}
          </Typography>
        </Stack>
      </Stack>
    </Box>
  );
}
