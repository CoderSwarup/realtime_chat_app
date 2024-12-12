import {
  Box,
  Divider,
  IconButton,
  Link,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
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
import CallMainPage from "../../components/CallComponets/CallMainPage";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCallLogs,
  StartCall,
} from "../../Redux/Slices/AudioVideoCallSlice";
import { useCall } from "../../contexts/WebRTCVideoCallContext";
import LoadingScreen from "../../components/LoadingScreen";

export default function CallPage() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [startCall, setstartCall] = useState(false);
  const { call_logs } = useSelector((state) => state.audiovideocall);
  const [callLogs_List, setCallLogsList] = useState(call_logs);
  const { callLoading, userOnCall } = useCall();

  const handleClosestartCall = () => {
    setstartCall(false);
  };

  const handleSearch = (e) => {
    const search = e.target.value;
    const filtered = call_logs.filter(
      (call_log) =>
        call_log.otherUser.firstName
          .toLowerCase()
          .includes(search.toLowerCase()) ||
        call_log.otherUser.lastName.toLowerCase().includes(search.toLowerCase())
    );
    setCallLogsList(filtered);
  };

  useEffect(() => {
    dispatch(fetchCallLogs());
  }, []);

  useEffect(() => {
    setCallLogsList(call_logs);
  }, [call_logs]);

  return (
    <>
      <Stack
        width={"100%"}
        direction={"row"}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{ position: "relative" }}
      >
        {callLoading ? (
          <LoadingScreen />
        ) : (
          <>
            {/* Left  */}
            <Box
              height={"100%"}
              sx={{
                position: "relative",
                width: {
                  // xs: "calc(100vw - 10px)",
                  xs: "100%",
                  md: 320,
                },
                display: {
                  xs: userOnCall ? "none" : "block",
                  md: "block",
                },
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
                      onChange={handleSearch}
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
                      <PhoneOutgoing
                        sx={{ color: theme.palette.primary.main }}
                      />
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

                  {callLogs_List?.map((ele) => {
                    return <CallLogElement key={ele.id} {...ele} />;
                  })}
                </Stack>
              </Stack>
            </Box>

            {/* Right Side Call Main Page  */}
            <CallMainPage />
          </>
        )}
      </Stack>

      <StartCallDialog open={startCall} handleClose={handleClosestartCall} />
    </>
  );
}
