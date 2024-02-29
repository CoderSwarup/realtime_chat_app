import React, { useState } from "react";
import {
  Box,
  Fab,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
  useTheme,
} from "@mui/material";
import {
  Camera,
  File,
  Image,
  LinkSimple,
  PaperPlaneTilt,
  Smiley,
  Sticker,
  User,
} from "phosphor-react";
import styled from "@emotion/styled";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useSelector } from "react-redux";
import { useRef } from "react";
import { socket } from "../../Socket";

const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiBadge-badge": {
    paddingTop: "12px",
    paddingBottom: "12px",
  },
}));

// Actions
const Actions = [
  {
    color: "#4da5fe",
    icon: <Image size={24} />,
    y: 102,
    title: "Photo/Video",
  },
  {
    color: "#4da5fe",
    icon: <Sticker size={24} />,
    y: 172,
    title: "Stickers",
  },
  {
    color: "#4da5fe",
    icon: <Camera size={24} />,
    y: 242,
    title: "Image",
  },
  {
    color: "#4da5fe",
    icon: <File size={24} />,
    y: 312,
    title: "Document",
  },
  {
    color: "#4da5fe",
    icon: <User size={24} />,
    y: 382,
    title: "Contact",
  },
];

function linkify(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return text.replace(
    urlRegex,
    (url) => `<a href="${url}" target="_blank">${url}</a>`
  );
}

function containsUrl(text) {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return urlRegex.test(text);
}

export default function Footer() {
  const theme = useTheme();

  const [openEmojiPicker, setOpenEmojiPicker] = useState(false);

  const [openActions, setOpenActions] = useState(false);

  const user_id = window.localStorage.getItem("user_id");

  const { sideBar, room_id } = useSelector((state) => state.app);
  const { current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );

  const [value, setValue] = useState("");
  const inputRef = useRef(null);

  function handleEmojiClick(emoji) {
    const input = inputRef.current;

    if (input) {
      const selectionStart = input.selectionStart;
      const selectionEnd = input.selectionEnd;

      setValue(
        value.substring(0, selectionStart) +
          emoji +
          value.substring(selectionEnd)
      );

      // Move the cursor to the end of the inserted emoji
      input.selectionStart = input.selectionEnd = selectionStart + 1;
    }
  }
  return (
    <Box
      p={2}
      sx={{
        width: "100%",
        background:
          theme.palette.mode == "light"
            ? "#FAFAFE"
            : theme.palette.background.paper,
      }}
    >
      <Stack alignItems={"center"} spacing={3} direction={"row"}>
        <Stack sx={{ width: "100%" }}>
          {/* Emoji Picker */}
          <Box
            sx={{
              display: openEmojiPicker ? "inline" : "none",
              zIndex: 1,
              position: "fixed",
              bottom: 81,
              right: 80,
            }}
          >
            <Picker
              theme={theme.palette.mode}
              data={data}
              // onEmojiSelect={console.log}
              onEmojiSelect={(emoji) => {
                handleEmojiClick(emoji.native);
              }}
            ></Picker>
          </Box>

          {/* Chat Input */}
          <StyledInput
            fullWidth
            value={value}
            inputRef={inputRef}
            onChange={(event) => {
              setValue(event.target.value);
            }}
            placeholder="Write a Message......."
            variant="filled"
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <Stack sx={{ width: "max-content" }}>
                  <Stack
                    sx={{
                      position: "relative",
                      display: openActions ? "inline-block" : "none",
                    }}
                  >
                    {Actions.map((ele, i) => {
                      return (
                        <Tooltip key={i} placement="right" title={ele.title}>
                          <Fab
                            sx={{
                              position: "absolute",
                              top: -ele.y,
                              background: ele.color,
                            }}
                            size="small"
                            color="secondary"
                            aria-label="add"
                          >
                            {ele.icon}
                          </Fab>
                        </Tooltip>
                      );
                    })}
                  </Stack>
                  <InputAdornment position="start">
                    <IconButton onClick={() => setOpenActions(!openActions)}>
                      <LinkSimple></LinkSimple>
                    </IconButton>
                  </InputAdornment>
                </Stack>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setOpenEmojiPicker(!openEmojiPicker)}
                  >
                    <Smiley />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Stack>

        <Box
          sx={{
            width: 48,
            height: 48,
            background: theme.palette.primary.main,
            borderRadius: 1.5,
          }}
        >
          <Stack
            sx={{
              height: "100%",
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <IconButton
              onClick={() => {
                if (value === "") return;
                socket.emit("text_message", {
                  message: linkify(value),
                  conversation_id: room_id,
                  from: user_id,
                  to: current_conversation.user_id,
                  type: containsUrl(value) ? "Link" : "Text",
                });
                setValue("");
              }}
            >
              <PaperPlaneTilt color="#fff" />
            </IconButton>
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
}
