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
        {Chat_History.map((ele) => {
          switch (ele.type) {
            case "divider":
              return <TimeLine ele={ele} />;
            case "msg":
              switch (ele.subtype) {
                case "img":
                  return <MediaMessage ele={ele} />;
                case "doc":
                  return <DocMessage ele={ele} />;
                case "link":
                  return <LinkMsg ele={ele} />;
                case "reply":
                  return <ReplyMessage ele={ele} />;
                default:
                  return <TextMsg ele={ele} />;
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
