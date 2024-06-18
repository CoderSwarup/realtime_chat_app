import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArchiveBox,
  CircleDashed,
  MagnifyingGlass,
  Users,
} from "phosphor-react";
import { styled, alpha } from "@mui/material/styles";
import React, { useEffect, useState } from "react";
import { Faker } from "@faker-js/faker";
import { ChatList } from "../../data";
import { SimpleBarStyle } from "../../components/Scrollbar";
import { useTheme } from "@mui/material/styles";
import Search, {
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import ChatElement from "../../components/ChatElement";
import Friends from "../../Sections/main/Friends";
import { socket } from "../../Socket";
import { useDispatch, useSelector } from "react-redux";
import { FetchDirectConversations } from "../../Redux/Slices/ConversationSlice";
// Chat Element

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

export default function Chats() {
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = useState(false);
  const theme = useTheme();
  const user_id = window.localStorage.getItem("user_id");
  const { conversations } = useSelector(
    (state) => state.conversation.direct_chat
  );

  const [chatList, setChatList] = useState([]);

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  useEffect(() => {
    socket.emit("get_direct_conersation", { user_id }, (converstionsist) => {
      dispatch(FetchDirectConversations({ conversations: converstionsist }));
    });
  }, []);

  useEffect(() => {
    setChatList(conversations);
  }, [conversations]);

  const handleSearch = (e) => {
    const search_value = e.target.value;
    if (search_value === "") {
      setChatList(conversations);
    }
    const serachFilterList = conversations.filter((user) => {
      return user.name.toLowerCase().includes(search_value.toLowerCase());
    });
    setChatList(serachFilterList);
  };
  return (
    <>
      <Box
        sx={{
          position: "relative",
          width: {
            xs: "100%",
            md: 320,
          },
          background:
            theme.palette.mode == "light"
              ? "#F8FAFE"
              : theme.palette.background.paper,
          boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
        }}
      >
        <Stack p={3} sx={{ height: "100vh" }} spacing={2}>
          {/* Top Heading */}
          <Stack
            sx={{ justifyContent: "space-between", alignItems: "center" }}
            direction="row"
          >
            <Typography variant="h5">Chats</Typography>
            <Stack direction={"row"} spacing={1} alignItems={"center"}>
              <IconButton
                onClick={() => {
                  handleOpenDialog();
                }}
              >
                <Users />
              </IconButton>
              <IconButton>
                <CircleDashed />
              </IconButton>
            </Stack>
          </Stack>

          {/* Search Component */}
          <Stack direction="row" sx={{ width: "100%" }}>
            <Search>
              <SearchIconWrapper>
                <MagnifyingGlass color="#709CE6" />
              </SearchIconWrapper>
              <StyledInputBase
                onChange={(e) => {
                  handleSearch(e);
                }}
                placeholder="Search"
                inputProps={{ "aria-label": "search" }}
              ></StyledInputBase>
            </Search>
          </Stack>

          <Stack spacing={1}>
            {/* Archive */}
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <ArchiveBox size={24}></ArchiveBox>
              <Button>Archive</Button>
            </Stack>

            {/* Devider */}
            <Divider></Divider>
          </Stack>

          {/* Chat Element */}

          <Stack
            spacing={2}
            className="hideScrollBar"
            direction="column"
            sx={{ flexGrow: 1, overflowY: "scroll", height: "100%" }}
          >
            {/* Pinned Chat */}
            {/* <Stack spacing={2.4}>
              <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                Pinned
              </Typography>

              {ChatList.filter((e) => e.pinned).map((ele, i) => {
                return <ChatElement key={i} {...ele} />;
              })}
            </Stack> */}

            {/* all Chats */}
            <Stack spacing={2.4}>
              <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                All Chats
              </Typography>

              {conversations
                .filter((e) => !e.pinned)
                .map((ele, i) => {
                  return (
                    <ChatElement key={i} {...ele} chat_type="individual" />
                  );
                })}
            </Stack>
          </Stack>
        </Stack>
      </Box>

      {openDialog && (
        <Friends open={openDialog} handleclose={handleCloseDialog} />
      )}
    </>
  );
}
