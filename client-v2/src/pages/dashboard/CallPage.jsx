import {
  Box,
  Divider,
  IconButton,
  Link,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import Conversation from "../../components/Conversation";
import {
  Chat,
  MagnifyingGlass,
  PhoneCall,
  PhoneOutgoing,
  PlusCircle,
} from "phosphor-react";
import Search, {
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import { Call_Logs_List, ChatList } from "../../data";
import CreateGroupChat from "../../Sections/main/CreateGroupChat";
import { CallLogElement } from "../../components/CallLogElement";
import StartCallDialog from "../../Sections/main/StartCallDialog";

export default function CallPage() {
  const theme = useTheme();

  const [startCall, setstartCall] = useState(false);

  const handleClosestartCall = () => {
    setstartCall(false);
  };
  return (
    <>
      <Stack
        width={"100%"}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{ position: "relative" }}
      >
        {/* Left  */}
        <Box
          height={"100%"}
          sx={{
            position: "relative",
            width: 320,
            background:
              theme.palette.mode == "light"
                ? "#F8FAFE"
                : theme.palette.background.paper,
            boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
          }}
        >
          <Stack spacing={3} p={3} sx={{ height: "100vh" }}>
            {/* Heading */}
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              spacing={1}
            >
              <Typography variant="h5">Call Logs</Typography>
              <IconButton>
                <PhoneCall />{" "}
              </IconButton>
            </Stack>

            {/* Search */}
            <Stack direction="row" sx={{ width: "100%" }}>
              <Search>
                <SearchIconWrapper>
                  <MagnifyingGlass color="#709CE6" />
                </SearchIconWrapper>
                <StyledInputBase
                  placeholder="Search Groups"
                  inputProps={{ "aria-label": "search" }}
                ></StyledInputBase>
              </Search>
            </Stack>

            {/* Create New Call Conversation */}
            <Stack spacing={1}>
              <Stack
                direction={"row"}
                spacing={2}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Typography variant="subtitle2" component={Link}>
                  Create New ConverSation
                </Typography>
                <IconButton onClick={() => setstartCall(true)}>
                  <PhoneOutgoing sx={{ color: theme.palette.primary.main }} />
                </IconButton>
              </Stack>
              <Divider />
            </Stack>

            <Stack
              spacing={3}
              className="hideScrollBar"
              direction="column"
              sx={{ flexGrow: 1, overflowY: "scroll", height: "100%" }}
            >
              {/* Calling Conversations  call logs */}

              {Call_Logs_List.map((ele) => {
                return <CallLogElement key={ele.id} {...ele} />;
              })}
            </Stack>
          </Stack>
        </Box>

        {/* Right Conversation  */}
        <Box
          sx={{
            height: "100%",
            width: "calc(100vw - 410px)", // if we need sidebar -720px
            background:
              theme.palette.mode == "light"
                ? "#F0F4FE"
                : theme.palette.background.default,
          }}
        ></Box>
      </Stack>

      <StartCallDialog open={startCall} handleClose={handleClosestartCall} />
    </>
  );
}
