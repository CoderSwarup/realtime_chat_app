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

export default function Messages() {
  return (
    <Box p={3}>
      <Stack spacing={3}>
        {Chat_History.map((ele, i) => {
          switch (ele.type) {
            case "divider":
              return <TimeLine key={i} ele={ele} />;
            case "msg":
              switch (ele.subtype) {
                case "img":
                  return <MediaMessage key={i} ele={ele} />;
                case "doc":
                  return <DocMessage key={i} ele={ele} />;
                case "link":
                  return <LinkMsg key={i} ele={ele} />;
                case "reply":
                  return <ReplyMessage key={i} ele={ele} />;
                default:
                  return <TextMsg key={i} ele={ele} />;
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
