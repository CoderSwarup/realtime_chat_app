import { useTheme } from "@emotion/react";
import {
  Box,
  IconButton,
  Stack,
  Typography,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  CircularProgress,
  Tab,
  Tabs,
} from "@mui/material";
import { CaretLeft } from "phosphor-react";
import React, { useEffect, useState } from "react";
import { ToggleViewSideBar } from "../../../Redux/Slices/StorySlice";
import { useDispatch, useSelector } from "react-redux";
import { useGetMyStoryViewsAndReactions } from "../../../GraphQl/StoriesService/apis/query_api";
import LoadingScreen from "../../LoadingScreen";

export default function StoryViewsSidebar() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const userid = localStorage.getItem("user_id");
  const { selectedStory } = useSelector((state) => state.story);
  const { fetchStoryViewsAndReactions, loading, error, data, refetch } =
    useGetMyStoryViewsAndReactions();
  const { seenUsers, reactions } = data;
  const [tabValue, setTabValue] = useState(0); // State to manage the selected tab
  useEffect(() => {
    if (selectedStory?.user?.id && userid !== selectedStory?.user?.id) {
      dispatch(ToggleViewSideBar(false));
    } else {
      refetch();
    }
  }, [selectedStory, userid, dispatch]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Box
      sx={{
        background: theme.palette.background.paper,
        width: 320,
        position: "absolute",
        top: 0,
        right: 0,
        height: "100vh",
        boxShadow: "0px 0px 10px rgba(0,0,0,0.1)",
        zIndex: 1000,
      }}
    >
      <Stack sx={{ height: "100%" }}>
        {/* Header box */}
        <Box
          sx={{
            boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
            width: "100%",
            background:
              theme.palette.mode === "light"
                ? "#FAFAFF"
                : theme.palette.background.default,
          }}
        >
          <Stack
            sx={{ height: "100%", padding: 2 }}
            direction={"row"}
            alignItems={"center"}
            spacing={1}
          >
            <IconButton onClick={() => dispatch(ToggleViewSideBar(false))}>
              <CaretLeft size={24} />
            </IconButton>
            <Typography variant="subtitle2">Your Story Views</Typography>
          </Stack>
        </Box>

        {/* Tab navigation */}
        <Tabs
          value={tabValue}
          onChange={(e, newValue) => setTabValue(newValue)}
          variant="fullWidth"
          indicatorColor="primary"
        >
          <Tab label="Seen Users" />
          <Tab label="Reactions" />
        </Tabs>

        {/* Content area */}
        <Box sx={{ flex: 1, overflowY: "auto", padding: 2 }}>
          {tabValue === 0 && (
            // Display seen users list
            <Stack
              sx={{ height: "100%", width: "100%" }}
              justifyContent="start"
              alignItems="center"
            >
              {seenUsers && seenUsers.length > 0 ? (
                <List
                  sx={{
                    width: "100%",
                  }}
                >
                  {seenUsers.map((user) => (
                    <ListItem key={user.id}>
                      <ListItemAvatar>
                        <Avatar src={user.avatar} alt={user.name} />
                      </ListItemAvatar>
                      <ListItemText
                        primary={user.name}
                        secondary={user.email}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" color="textSecondary">
                  No seen users yet.
                </Typography>
              )}
            </Stack>
          )}
          {tabValue === 1 && (
            // Display reactions list
            <Stack
              sx={{ height: "100%", width: "100%" }}
              justifyContent="start"
              alignItems="center"
            >
              {reactions && reactions.length > 0 ? (
                <List>
                  {reactions.map((reaction, index) => (
                    <ListItem key={index}>
                      <ListItemText
                        primary={reaction.user.name}
                        secondary={`Reaction: ${reaction.reactionType}`}
                      />
                    </ListItem>
                  ))}
                </List>
              ) : (
                <Typography variant="body1" color="textSecondary">
                  No reactions yet.
                </Typography>
              )}
            </Stack>
          )}
        </Box>
      </Stack>
    </Box>
  );
}
