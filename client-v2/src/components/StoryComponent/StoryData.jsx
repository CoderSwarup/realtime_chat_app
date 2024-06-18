import { useTheme } from "@emotion/react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import {
  CaretCircleLeft,
  CaretCircleRight,
  DotsThreeVertical,
  Eye,
  ThumbsUp,
} from "phosphor-react";
import React, { useEffect, useState } from "react";
import { StoryMenu } from "../../data";
import i from "../../assets/react.svg";
import "../../index.css";
import {
  ToggleStory,
  ToggleViewSideBar,
  setSelectStory,
} from "../../Redux/Slices/StorySlice";
import { useDispatch, useSelector } from "react-redux";
import StoryViewsSidebar from "./StorySideBar/StoryViewsSidebar";
import { formatTime, isToday } from "../../utils/Time";
import { MARK_STORY_AS_SEEN } from "../../GraphQl/StoriesService/mutations";
import { useMutation } from "@apollo/client";
const user_id = localStorage.getItem("user_id");
const StoryType = ({ story }) => {
  const theme = useTheme();
  const { storyType, storyData, isSeen } = story;
  if (storyType === "Text") {
    return (
      <Stack
        justifyContent={"center"}
        alignItems={"center"}
        width={"90%"}
        height={"75vh"}
        className="hideScrollBar"
        sx={{
          borderLeft: `1px solid  ${theme.palette.primary.main}`,
          borderRight: `1px solid  ${theme.palette.primary.main}`,
          py: 4,
          px: 2,
          overflowY: "scroll",
        }}
      >
        <Typography variant="body1" sx={{ color: theme.palette.primary.main }}>
          {" "}
          {storyData?.text}
        </Typography>
      </Stack>
    );
  } else if (storyType === "Image") {
    return (
      <Box
        width={"90%"}
        height={"75vh"}
        sx={{
          borderLeft: `1px solid  ${theme.palette.primary.main}`,
          borderRight: `1px solid  ${theme.palette.primary.main}`,
          px: 2,
        }}
      >
        <img
          src={storyData?.url}
          alt=""
          width={"100%"}
          height={"100%"}
          style={{ objectFit: "conatin" }}
        />
      </Box>
    );
  }

  return (
    <Stack
      justifyContent={"center"}
      alignItems={"center"}
      width={"60%"}
      height={"75vh"}
      className="hideScrollBar"
      sx={{
        borderLeft: `1px solid  ${theme.palette.primary.main}`,
        borderRight: `1px solid  ${theme.palette.primary.main}`,
        py: 4,
        px: 2,
        overflowY: "scroll",
      }}
    >
      <Typography
        variant="body1"
        sx={{
          color: "red",
          fontWeight: 700,
          letterSpacing: 2,
          fontFamily: "roboto",
        }}
      >
        SOMETHING WRONG
      </Typography>
    </Stack>
  );
};

const Carousel = ({
  stories,
  activeStoryindex,
  setActiveStoryIndex,
  isMyStory,
}) => {
  const theme = useTheme();

  const [markStoryAsSeenMutation] = useMutation(MARK_STORY_AS_SEEN);
  const handleNext = () => {
    setActiveStoryIndex((prevIndex) =>
      prevIndex === stories.length - 1 ? stories.length - 1 : prevIndex + 1
    );
  };

  const handlePrev = () => {
    setActiveStoryIndex((prevIndex) =>
      prevIndex === 0 ? stories.length - 1 : prevIndex - 1
    );
  };
  useEffect(() => {
    if (!isMyStory) {
      markStoryAsSeenMutation({
        variables: {
          storyId: stories[activeStoryindex].id, // Assuming the story ID is stored in the 'id' field
          userId: user_id, // Replace with the actual user ID
        },
      });
    }
  }, [activeStoryindex]);
  return (
    <Stack
      flexShrink={0}
      alignItems={"center"}
      justifyContent={"center"}
      direction="row"
      height="100%"
      width="100%"
      gap={2}
    >
      <IconButton
        size="md"
        disabled={activeStoryindex === 0}
        onClick={handlePrev}
        sx={{
          mb: 10,
        }}
      >
        <CaretCircleLeft />
      </IconButton>
      <StoryType
        story={stories[activeStoryindex]}
        isActive={activeStoryindex}
      />

      <IconButton
        size="md"
        disabled={activeStoryindex == stories.length - 1}
        onClick={handleNext}
        sx={{
          mb: 10,
        }}
      >
        <CaretCircleRight />
      </IconButton>
    </Stack>
  );
};
export default function StoryData({ isMyStory }) {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [activeStoryindex, setActiveStoryIndex] = useState(0);
  const { storyViewSidebar, selectedStory, selectedStoryId } = useSelector(
    (state) => state.story
  );

  const { userdetails } = useSelector((state) => state.auth);
  const Name = selectedStory?.user?.name;
  const date = new Date(
    selectedStory?.stories
      ? selectedStory?.stories[selectedStory?.stories?.length - 1]?.updatedAt
      : ""
  );

  const displayTime = isToday(date)
    ? `Today ${formatTime(date)}`
    : date.toDateString();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleSelectStory = () => {
    dispatch(ToggleStory(false));
    dispatch(ToggleViewSideBar(false));
    dispatch(setSelectStory(null, {}));
  };

  useEffect(() => {
    setActiveStoryIndex(0);
  }, [selectedStoryId]);
  if (isMyStory && !selectedStory?.stories) {
    return (
      <>
        <Stack
          width={"100%"}
          height={"100%"}
          alignItems={"center"}
          justifyContent={"center"}
        >
          <Typography>PLEASE UPLOAD STORY</Typography>
          <Button
            onClick={handleSelectStory}
            variant="outlined"
            size="large"
            sx={{ my: 2 }}
          >
            BACK
          </Button>
        </Stack>
      </>
    );
  }

  return (
    <>
      <Stack
        direction={"column"}
        justifyContent={"space-between"}
        alignItems={"center"}
        height={"100%"}
        width={"100%"}
        p={2}
      >
        {/* Top Header */}
        <Box
          sx={{
            width: "100%",
            borderBottom: `1px solid  ${theme.palette.primary.main}`,
            paddingBottom: 2,
          }}
        >
          <Stack
            marginBottom={1}
            direction={"row"}
            width={"100%"}
            gap={1}
            alignItems={"center"}
          >
            {selectedStory?.stories &&
              selectedStory?.stories.map((story, i) => (
                <div
                  className={`progress-bar ${
                    activeStoryindex === i ? "active" : ""
                  } ${activeStoryindex > i ? "complete" : ""}  `}
                ></div>
              ))}
          </Stack>

          <Stack
            position={"relative"}
            direction={"row"}
            justifyContent={"space-between"}
            alignItems={"center"}
            sx={{ width: "100%" }}
            paddingTop={0.5}
          >
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              gap={2}
            >
              <IconButton
                onClick={() => {
                  handleSelectStory();
                }}
              >
                <CaretCircleLeft />
              </IconButton>
              <Avatar
                src={
                  isMyStory ? userdetails?.avatar : selectedStory?.user?.avatar
                }
                alt="user name"
              ></Avatar>
              <Stack
                sx={{
                  width: "100%",
                }}
              >
                <Typography variant="body2">
                  {" "}
                  {isMyStory ? "MY STORY" : Name}
                </Typography>
                <Typography variant="caption">
                  {" "}
                  {!selectedStory?.stories ? "No Stroy Aailable" : displayTime}
                </Typography>
              </Stack>
            </Stack>

            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              {isMyStory && (
                <IconButton
                  onClick={() => {
                    dispatch(ToggleViewSideBar(true));
                  }}
                >
                  <Eye></Eye>
                </IconButton>
              )}
              {/* Memu */}

              <IconButton id="story-menu" onClick={handleClick}>
                <DotsThreeVertical />
              </IconButton>
              <Menu
                id="story-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
              >
                <Stack spacing={1} p={0.5}>
                  {!isMyStory
                    ? StoryMenu.map((ele, i) => {
                        return (
                          !ele?.isMyStoryEle && (
                            <MenuItem key={i} onClick={handleClose}>
                              <Stack
                                sx={{ width: 80 }}
                                direction={"row"}
                                alignItems={"center"}
                                justifyContent={"space-between"}
                              >
                                <span>{ele.title}</span>
                              </Stack>
                            </MenuItem>
                          )
                        );
                      })
                    : StoryMenu.map((ele, i) => {
                        return (
                          ele?.isMyStoryEle && (
                            <MenuItem key={i} onClick={handleClose}>
                              <Stack
                                sx={{ width: 80 }}
                                direction={"row"}
                                alignItems={"center"}
                                justifyContent={"space-between"}
                              >
                                <span>{ele.title}</span>
                              </Stack>
                            </MenuItem>
                          )
                        );
                      })}
                </Stack>
              </Menu>
            </Stack>
          </Stack>
        </Box>
        {/* Moddle */}

        <Stack
          sx={{
            position: "relative",
            overflow: "hidden",
            objectFit: "cover",
            width: "100%",
            height: "100%",
          }}
          justifyContent={"center"}
          alignItems={"center"}
        >
          {/* <Stack direction={"row"} height={"100%"} width={"300px"}>
            {selectedStory?.stories &&
              selectedStory?.stories.map((story) => {
                return <StoryType story={story} />;
              })}
          </Stack> */}
          {selectedStory?.stories?.length > 0 && (
            <Carousel
              activeStoryindex={activeStoryindex}
              setActiveStoryIndex={setActiveStoryIndex}
              stories={selectedStory?.stories}
              isMyStory={isMyStory}
            />
          )}
        </Stack>

        {/* Footer */}
        <Box
          sx={{
            width: "100%",
            borderTop: `1px solid  ${theme.palette.primary.main}`,
            paddingTop: 2,
          }}
        >
          <Stack
            direction={"row"}
            alignItems={"flex-start"}
            justifyContent={"start"}
          >
            <IconButton>
              <ThumbsUp fontSize={33} color="yellow" filled />
            </IconButton>
          </Stack>
        </Box>
      </Stack>

      {storyViewSidebar && <StoryViewsSidebar />}
    </>
  );
}
