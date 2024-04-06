import { Avatar, Badge, Box, Stack, Typography, useTheme } from "@mui/material";
import StyledBadge from "../Conversation/StyledBadge";
import { useSelector, useDispatch } from "react-redux";
import { SelectConversation } from "../../Redux/Slices/AppSlice";
const GroupChatElement = ({
  id,
  name,
  img,
  msg,
  time,
  unread,
  online,
  chat_type,
}) => {
  const theme = useTheme();
  const dispatch = useDispatch();

  const { current_conversation } = useSelector((state) => {
    return state.conversation.group_chat;
  });

  return (
    <Box
      onClick={() => {
        dispatch(SelectConversation({ room_id: id, chat_type }));
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

export default GroupChatElement;
