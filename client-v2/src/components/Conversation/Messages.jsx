import { Box, Stack } from "@mui/material";
import React from "react";
import { Chat_History } from "../../data";
import {
  DocMessage,
  LinkMsg,
  MediaMessage,
  ReplyMessage,
  TextMsg,
  TimeLine,
} from "./MessageType";

export default function Messages({ menu = true }) {
  return (
    <Box p={3}>
      <Stack spacing={3}>
        {Chat_History.map((ele, i) => {
          switch (ele.type) {
            case "divider":
              return <TimeLine key={i} ele={ele} menu={menu} />;
            case "msg":
              switch (ele.subtype) {
                case "img":
                  return <MediaMessage key={i} ele={ele} menu={menu} />;
                case "doc":
                  return <DocMessage key={i} ele={ele} menu={menu} />;
                case "link":
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
