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
import { Chat, MagnifyingGlass, PlusCircle } from "phosphor-react";
import Search, {
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import { ChatList } from "../../data";
import ChatElement from "../../components/ChatElement";
import CreateGroupChat from "../../Sections/main/CreateGroupChat";
import GroupChatConversion from "../../components/Group_Chat_Conversion";

export default function Groups() {
  const theme = useTheme();

  const [openCreateGroupchat, setOpenCreateGroupchat] = useState(false);
  const [chatList, setChatList] = useState(ChatList);
  const handleCloseCreateGroupchat = () => {
    setOpenCreateGroupchat(false);
  };

  const handleSearch = (e) => {
    const SearchValue = e.target.value;
    if (SearchValue === "") return setChatList(ChatList);
    const FilteredSearchChatList = ChatList.filter((chat) => {
      return chat.name
        .toLocaleLowerCase()
        .includes(SearchValue.toLocaleLowerCase());
    });
    setChatList(FilteredSearchChatList);
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
              <Typography variant="h5">Groups</Typography>
              <IconButton>
                <Chat />
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
                  onChange={(e) => handleSearch(e)}
                ></StyledInputBase>
              </Search>
            </Stack>

            {/* Create New Group */}
            <Stack spacing={1}>
              <Stack
                direction={"row"}
                spacing={2}
                alignItems={"center"}
                justifyContent={"space-between"}
              >
                <Typography variant="subtitle2" component={Link}>
                  Create New Group
                </Typography>
                <IconButton onClick={() => setOpenCreateGroupchat(true)}>
                  <PlusCircle sx={{ color: theme.palette.primary.main }} />
                </IconButton>
              </Stack>
              <Divider />
            </Stack>

            <Stack
              spacing={2}
              className="hideScrollBar"
              direction="column"
              sx={{ flexGrow: 1, overflowY: "scroll", height: "100%" }}
            >
              {/* Pinned Chat  */}
              {/* <Stack spacing={2}>
                <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                  Pinned
                </Typography>

                {ChatList.filter((e) => e.pinned).map((ele, i) => {
                  return <ChatElement key={i} {...ele} />;
                })}
              </Stack> */}

              {/* All Group Chats */}
              <Stack spacing={2}>
                <Typography variant="subtitle2" sx={{ color: "#676767" }}>
                  All Groups
                </Typography>

                {chatList
                  .filter((e) => !e.pinned)
                  .map((ele, i) => {
                    return <ChatElement key={i} {...ele} />;
                  })}
              </Stack>
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
        >
          <GroupChatConversion />
        </Box>
      </Stack>

      <CreateGroupChat
        open={openCreateGroupchat}
        handleClose={handleCloseCreateGroupchat}
      />
    </>
  );
}
