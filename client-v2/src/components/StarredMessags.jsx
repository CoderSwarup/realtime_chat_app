import { useTheme } from "@emotion/react";
import {
  Tabs,
  Box,
  IconButton,
  Stack,
  Tab,
  Typography,
  Grid,
} from "@mui/material";
import { CaretLeft } from "phosphor-react";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { UpdateSidebarType } from "../Redux/Slices/AppSlice";
import { faker } from "@faker-js/faker";
import { Shared_Docs, Shared_Links } from "../data";
import { DocMessage, LinkMsg } from "./Conversation/MessageType";
import Messages from "./Conversation/Messages";

export default function StarredMessags() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box
      sx={{
        background: theme.palette.background.paper,
        width: 320,
        position: "absolute",
        top: 0,
        right: 0,
        height: "100vh",
      }}
    >
      <Stack sx={{ height: "100%" }}>
        {/* Header box */}
        <Box
          sx={{
            boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
            width: "100%",
            background:
              theme.palette.mode == "light"
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
            <IconButton
              onClick={() => {
                dispatch(UpdateSidebarType("CONTACT"));
              }}
            >
              <CaretLeft />
            </IconButton>
            <Typography variant="subtitle2">Starred Message</Typography>
          </Stack>
        </Box>

        {/* Main Body */}
        <Stack
          className="hideScrollBar"
          sx={{
            width: "100%",
            height: "100%",
            position: "relative",
            flexGrow: 1,
            overflowX: "hidden",
            overflowY: "scroll",
          }}
          p={1}
          spacing={3}
        >
          <Messages menu={false} />
        </Stack>
      </Stack>
    </Box>
  );
}
