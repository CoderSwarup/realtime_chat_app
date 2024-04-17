import React from "react";
import StyledBadge from "./Conversation/StyledBadge";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { socket } from "../Socket";
import { Chat } from "phosphor-react";
export function UserComponent({ firstName, lastName, _id, avatar, status }) {
  const theme = useTheme();
  const name = firstName + " " + lastName;
  const user_id = window.localStorage.getItem("user_id");
  return (
    <Box
      sx={{
        width: "100%",

        borderRadius: 1,

        backgroundColor: theme.palette.background.paper,
      }}
    >
      <Stack
        direction={"row"}
        p={1}
        alignItems={"center"}
        justifyContent={"space-between"}
        sx={{
          cursor: "pointer",
          borderRadius: 1,
          backgroundColor: theme.palette.background.paper,
        }}
      >
        {status == "Online" ? (
          <StyledBadge
            variant="dot"
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
          >
            <Avatar src={avatar?.url} alt={firstName}></Avatar>
          </StyledBadge>
        ) : (
          <Avatar src={avatar?.url} alt={firstName}></Avatar>
        )}

        <Typography variant="body2">{name}</Typography>

        <Button
          variant="outlined"
          onClick={() => {
            socket.emit("friend_request", { from: user_id, to: _id });
          }}
        >
          <Typography variant="body2">Send Request</Typography>
        </Button>
      </Stack>
    </Box>
  );
}

export const FriendRequestElement = ({
  avatar,
  firstName,
  lastName,
  status,
  id,
}) => {
  const theme = useTheme();

  const name = `${firstName} ${lastName}`;

  return (
    <Box
      sx={{
        width: "100%",

        borderRadius: 1,

        backgroundColor: theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems={"center"} spacing={2}>
          {" "}
          {status == "Online" ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar alt={name} src={avatar?.url} />
            </StyledBadge>
          ) : (
            <Avatar alt={name} src={avatar?.url} />
          )}
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <Button
            onClick={() => {
              //  emit "accept_request" event
              socket.emit("accept_request", { request_id: id });
            }}
          >
            Accept Request
          </Button>
        </Stack>
      </Stack>
    </Box>
  );
};

export const FriendElement = ({ avatar, firstName, lastName, status, _id }) => {
  const theme = useTheme();
  const name = `${firstName} ${lastName}`;
  const user_id = window.localStorage.getItem("user_id");
  return (
    <Box
      sx={{
        width: "100%",

        borderRadius: 1,

        backgroundColor: theme.palette.background.paper,
      }}
      p={2}
    >
      <Stack
        direction="row"
        alignItems={"center"}
        justifyContent="space-between"
      >
        <Stack direction="row" alignItems={"center"} spacing={2}>
          {" "}
          {status == "Online" ? (
            <StyledBadge
              overlap="circular"
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              variant="dot"
            >
              <Avatar alt={name} src={avatar?.url} />
            </StyledBadge>
          ) : (
            <Avatar alt={name} src={avatar?.url} />
          )}
          <Stack spacing={0.3}>
            <Typography variant="subtitle2">{name}</Typography>
          </Stack>
        </Stack>
        <Stack direction={"row"} spacing={2} alignItems={"center"}>
          <IconButton
            onClick={() => {
              // start a new conversation
              socket.emit("start_conversation", { to: _id, from: user_id });
            }}
          >
            <Chat />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
};
