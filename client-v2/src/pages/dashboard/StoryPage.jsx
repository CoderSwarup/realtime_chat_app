import { useTheme } from "@emotion/react";
import { Box, Stack, Typography } from "@mui/material";
import React, { useState } from "react";
import StoryData from "../../components/StoryComponent/StoryData";
import NoChat from "../../assets/Illustration/NoChat";
import StoryMainSideBar from "../../components/StoryComponent/StorySideBar/StoryMainSideBar";
import {
  UploadTypeImage,
  UploadTypeText,
  UploadTypeVideo,
} from "../../components/StoryComponent/StorySideBar/StoryUploadType";
import { useSelector } from "react-redux";

export default function StoryPage() {
  const theme = useTheme();
  const { sidebarIndex, isStorySelected, selectedStoryId } = useSelector(
    (state) => state.story
  );
  const user_id = localStorage.getItem("user_id");
  return (
    <>
      <Stack
        width={"100%"}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{
          position: "relative",
          overflow: {
            xs: "hidden",
            md: "auto",
          },
        }}
      >
        {/* Left SideBar */}
        <Box
          sx={{
            position: "relative",
            width: {
              xs: "100%",
              md: 400,
            },

            background:
              theme.palette.mode == "light"
                ? "#F8FAFE"
                : theme.palette.background.paper,
            boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
          }}
        >
          {(() => {
            switch (sidebarIndex) {
              case 0:
                return <StoryMainSideBar />;
              case 1:
                return <UploadTypeText />;

              case 2:
                return <UploadTypeImage />;

              case 3:
                return <UploadTypeVideo />;
              default:
                return <StoryMainSideBar />;
            }
          })()}
        </Box>

        {/* Right Main Content */}
        <Box
          sx={{
            height: "100%",
            zIndex: isStorySelected ? 1 : "-1",
            position: {
              xs: "absolute",
              md: "relative",
            },
            width: {
              xs: "100%",
              md: "calc(100vw - 490px)",
            }, // if we need sidebar -720px
            background:
              theme.palette.mode == "light"
                ? "#F0F4FE"
                : theme.palette.background.default,
          }}
        >
          {isStorySelected ? (
            <StoryData
              isSeen={false}
              isMyStory={selectedStoryId === user_id}
              UploadedTime={"11:09"}
            />
          ) : (
            <Stack
              width={"100%"}
              height={"100%"}
              spacing={3}
              alignItems={"center"}
              justifyContent={"center"}
            >
              <Stack
                width={"100px"}
                height={"100px"}
                spacing={3}
                alignItems={"center"}
                justifyContent={"center"}
              >
                <NoChat />{" "}
                <Typography variant="subtitle">Select a Story</Typography>
              </Stack>
            </Stack>
          )}
        </Box>
      </Stack>
    </>
  );
}
