import React, { useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Avatar, Tooltip } from "@chakra-ui/react";
import {
  isLastMessage,
  isSameSender,
  isSameSenderMargin,
  isSameUser,
} from "../../config/ChatLogics";

import "./Chat.style.css"; // Import your custom CSS file

export default function ScrollableChat({ istyping }) {
  const { messages } = useSelector((state) => state.message);
  const { user } = useSelector((state) => state.user);

  const chatContainerRef = useRef(null);

  useEffect(() => {
    // Scroll down to the latest message when messages change
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div ref={chatContainerRef} className="scrollable-chat-container">
      {messages &&
        messages.map((m, i) => {
          return (
            <div key={i} className="message-container">
              <div className="message-wrapper">
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
                    marginLeft: isSameSenderMargin(
                      messages,
                      m,
                      i,
                      user.user._id
                    ),
                  }}
                  className={`message-content ${
                    m.sender._id === user.user._id
                      ? "my-message"
                      : "other-message"
                  }`}
                >
                  {m.content}
                </span>
              </div>
            </div>
          );
        })}
      {istyping && <p>Typing..</p>}
    </div>
  );
}
