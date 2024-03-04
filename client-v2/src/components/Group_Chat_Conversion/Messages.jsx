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

export default function Messages({ menu = true }) {
  const dispatch = useDispatch();

  return (
    <Box p={3}>
      <Stack spacing={3}>
        {Chat_History.map((ele, i) => {
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
