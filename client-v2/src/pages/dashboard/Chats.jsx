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
import { ArchiveBox, CircleDashed, MagnifyingGlass } from "phosphor-react";
import { styled, alpha } from "@mui/material/styles";
import React from "react";
import { Faker } from "@faker-js/faker";
import { ChatList } from "../../data";
import { SimpleBarStyle } from "../../components/Scrollbar";
import { useTheme } from "@mui/material/styles";
import Search, {
  SearchIconWrapper,
  StyledInputBase,
} from "../../components/Search";
import ChatElement from "../../components/ChatElement";
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
  const theme = useTheme();
  return (
    <Box
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
      <Stack p={3} sx={{ height: "100vh" }} spacing={2}>
        {/* Top Heading */}
        <Stack
          sx={{ justifyContent: "space-between", alignItems: "center" }}
          direction="row"
        >
          <Typography variant="h5">Chats</Typography>
          <IconButton>
            <CircleDashed />
          </IconButton>
        </Stack>

        {/* Search Component */}
        <Stack direction="row" sx={{ width: "100%" }}>
          <Search>
            <SearchIconWrapper>
              <MagnifyingGlass color="#709CE6" />
            </SearchIconWrapper>
            <StyledInputBase
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
          <Stack spacing={2.4}>
            <Typography variant="subtitle2" sx={{ color: "#676767" }}>
              Pinned
            </Typography>

            {ChatList.filter((e) => e.pinned).map((ele, i) => {
              return <ChatElement key={i} {...ele} />;
            })}
          </Stack>

          {/* all Chats */}
          <Stack spacing={2.4}>
            <Typography variant="subtitle2" sx={{ color: "#676767" }}>
              All Chats
            </Typography>

            {ChatList.filter((e) => !e.pinned).map((ele, i) => {
              return <ChatElement key={i} {...ele} />;
            })}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
