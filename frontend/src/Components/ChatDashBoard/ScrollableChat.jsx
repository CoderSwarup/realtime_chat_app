import { Avatar, Tooltip } from "@chakra-ui/react";
import React from "react";
import { useSelector } from "react-redux";
import ScrollableFeed from "react-scrollable-feed";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogics";

export default function ScrollableChat({ istyping }) {
  const { messages } = useSelector((state) => state.message);
  const { user } = useSelector((state) => state.user);
  return (
    <ScrollableFeed className="hide">
      {messages &&
        messages.map((m, i) => {
          return (
            <div key={i}>
              <div style={{ display: "flex" }} key={m._id}>
                {(isSameSender(messages, m, i, user.user._id) ||
                  isLastMessage(messages, i, user.user._id)) && (
                  <Tooltip
                    label={m.sender.username}
                    placement="bottom-start"
                    hasArrow
                  >
                    <Avatar
                      bg="#fff"
                      mt="7px"
                      mr={1}
                      size="sm"
                      cursor="pointer"
                      name={m.sender.username}
                      src={m.sender.avatar}
                    />
                  </Tooltip>
                )}

                <span
                  style={{
                    backgroundColor: `${
                      m.sender._id === user.user._id ? "#BEE3F8" : "#B9F5D0"
                    }`,
                    color: "#000",
                    fontWeight: "600",

                    marginLeft: isSameSenderMargin(
                      messages,
                      m,
                      i,
                      user.user._id
                    ),
                    marginTop: isSameUser(messages, m, i, user.user._id)
                      ? 3
                      : 10,
                    borderRadius: "20px",
                    padding: "5px 15px",
                    maxWidth: "75%",
                  }}
                >
                  {m.content}
                </span>
              </div>
            </div>
          );
        })}

      {istyping && <p>Typing..</p>}
    </ScrollableFeed>
  );
}
