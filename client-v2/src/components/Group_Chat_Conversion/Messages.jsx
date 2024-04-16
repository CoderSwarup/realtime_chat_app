import { Box, Stack } from "@mui/material";
import React, { useEffect } from "react";
import { Chat_History } from "../../data";
import {
  DocMessage,
  LinkMsg,
  MediaMessage,
  ReplyMessage,
  TextMsg,
  TimeLine,
} from "../Conversation/MessageType";
import { useDispatch, useSelector } from "react-redux";

import { socket } from "../../Socket";
import {
  FetchCurrentGroupChatMessages,
  FetchGroupConversations,
  SetCurrentGroupConversation,
} from "../../Redux/Slices/ConversationSlice";

export default function Messages({ menu = true }) {
  const dispatch = useDispatch();
  const { conversations, current_messages } = useSelector(
    (state) => state.conversation.group_chat
  );
  const { room_id } = useSelector((state) => state.app);

  useEffect(() => {
    const current = conversations.find((el) => el?.id === room_id);
    socket.emit(
      "get_group_messages",
      { conversation_id: current?.id, room_id },
      (data) => {
        // data => list of messages
        // console.log(data, "List of messages");
        dispatch(FetchCurrentGroupChatMessages({ messages: data?.messages }));
      }
    );
    dispatch(SetCurrentGroupConversation(current));
  }, [room_id]);

  return (
    <Box p={3}>
      <Stack spacing={3}>
        {current_messages?.map((ele, i) => {
          switch (ele.type) {
            case "divider":
              return <TimeLine key={i} ele={ele} menu={menu} />;
            case "msg":
              switch (ele.subtype) {
                case "Media":
                  return <MediaMessage key={i} ele={ele} menu={menu} />;
                case "Document":
                  return <DocMessage key={i} ele={ele} menu={menu} />;
                case "Link":
                  return <LinkMsg key={i} ele={ele} menu={menu} />;
                case "reply":
                  return <ReplyMessage key={i} ele={ele} menu={menu} />;
                default:
                  return <TextMsg key={i} ele={ele} menu={menu} />;
              }
              break;
            default:
              break;
          }
        })}
      </Stack>
    </Box>
  );
}
