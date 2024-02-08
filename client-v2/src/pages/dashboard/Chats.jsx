import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  IconButton,
  InputBase,
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

const ChatElement = ({ id, name, img, msg, time, unread, online }) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        width: "100%",
        borderRadius: 1,
        height: 60,
        background:
          theme.palette.mode == "light"
            ? "#F8FAFE"
            : theme.palette.background.paper,
      }}
      p={1}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between">
        {/* Left side Avatar */}
        <Stack direction="row" spacing={1} alignItems="center">
          {/* Avatar */}
          {online ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar src={img}></Avatar>
            </StyledBadge>
          ) : (
            <Avatar src={img}></Avatar>
          )}

          {/* Text Name And Message  */}
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
            <Typography variant="caption">{msg.slice(0, 20)}..</Typography>
          </Stack>
        </Stack>

        {/* Time */}
        <Stack spacing={2} alignItems="center">
          <Typography sx={{ fontWeight: 600 }} variant="caption">
            {time}
          </Typography>
          <Badge color="primary" badgeContent={unread}></Badge>
        </Stack>
      </Stack>
    </Box>
  );
};
const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: 20,
  backgroundColor: alpha(theme.palette.background.default, 1),
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: "100%",
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
          direction="column"
          sx={{ flexGrow: 1, overflowY: "scroll", height: "100%" }}
        >
          {/* Pinned Chat */}
          <Stack spacing={2.4}>
            <Typography variant="subtitle2" sx={{ color: "#676767" }}>
              Pinned
            </Typography>

            {ChatList.filter((e) => e.pinned).map((ele) => {
              return <ChatElement {...ele} />;
            })}
          </Stack>

          {/* all Chats */}
          <Stack spacing={2.4}>
            <Typography variant="subtitle2" sx={{ color: "#676767" }}>
              All Chats
            </Typography>

            {ChatList.filter((e) => !e.pinned).map((ele) => {
              return <ChatElement {...ele} />;
            })}
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
