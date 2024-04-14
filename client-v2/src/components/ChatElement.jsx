import { Avatar, Badge, Box, Stack, Typography, useTheme } from "@mui/material";
import StyledBadge from "./Conversation/StyledBadge";
import { useDispatch, useSelector } from "react-redux";
import { SelectConversation } from "../Redux/Slices/AppSlice";
import { useEffect, useState } from "react";
import { socket } from "../Socket";
import { SetDirectChatAlertMsgToNull } from "../Redux/Slices/ConversationSlice";

const ChatElement = ({
  id,
  name,
  img,
  msg,
  time,
  unread,
  online,
  chat_type,
  alertMessage,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { current_conversation } = useSelector((state) => {
    return state.conversation.direct_chat;
  });
  const [AlertMsg, setAlertMsg] = useState(null);

  function CheckLocalStorage() {
    const DirectChat = JSON.parse(window.localStorage.getItem(id));
    if (DirectChat !== null) {
      setAlertMsg({
        letestMessage: DirectChat.letestMessage,
        count: DirectChat.count,
      });
    } else {
      setAlertMsg(alertMessage);
    }
  }
  useEffect(() => {
    CheckLocalStorage();
  }, [alertMessage]);

  return (
    <Box
      onClick={() => {
        dispatch(SelectConversation({ room_id: id, chat_type }));
        dispatch(SetDirectChatAlertMsgToNull(id));
        window.localStorage.removeItem(id);
        CheckLocalStorage();
      }}
      sx={{
        width: "100%",
        borderRadius: 1,
        height: 60,
        background:
          current_conversation?.id !== id
            ? theme.palette.background.paper
            : theme.palette.mode === "light"
            ? "lightblue"
            : theme.palette.primary.main,
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
            <Typography variant="caption">
              {AlertMsg?.letestMessage && (
                <>
                  {AlertMsg?.letestMessage?.slice(0, 20)}
                  {AlertMsg?.letestMessage.length > 20 ? "..." : ""}
                </>
              )}
            </Typography>
          </Stack>
        </Stack>

        {/* Time */}
        <Stack spacing={2} alignItems="center">
          <Typography sx={{ fontWeight: 600 }} variant="caption">
            {time}
          </Typography>
          <Badge color="secondary" badgeContent={AlertMsg?.count}></Badge>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ChatElement;
