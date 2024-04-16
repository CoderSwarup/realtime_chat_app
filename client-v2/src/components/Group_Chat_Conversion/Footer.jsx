import {
  Box,
  Fab,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Tooltip,
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
import { useTheme, styled } from "@mui/material/styles";
import React, { useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import useResponsive from "../../hooks/useResponsive";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { socket } from "../../Socket";
import { useSelector } from "react-redux";
import { containsUrl, linkify } from "../Conversation/Footer";
import FileSelectionDialog from "../../Sections/main/FileDialog";

const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiInputBase-input": {
    paddingTop: "12px !important",
    paddingBottom: "12px !important",
  },
}));

const Actions = [
  {
    color: "#4da5fe",
    icon: <Image size={24} />,
    y: 102,
    title: "Photo/Video",
    type: "Media", // Add type for file selection mode
  },
  {
    color: "#4da5fe",
    icon: <File size={24} />,
    y: 172,
    title: "Document",
    type: "Document", // Add type for file selection mode
  },
  // {
  //   color: "#4da5fe",
  //   icon: <Image size={24} />,
  //   y: 102,
  //   title: "Photo/Video",
  // },
  // {
  //   color: "#1b8cfe",
  //   icon: <Sticker size={24} />,
  //   y: 172,
  //   title: "Stickers",
  // },
  // {
  //   color: "#0172e4",
  //   icon: <Camera size={24} />,
  //   y: 242,
  //   title: "Image",
  // },
  // {
  //   color: "#0159b2",
  //   icon: <File size={24} />,
  //   y: 312,
  //   title: "Document",
  // },
  // {
  //   color: "#013f7f",
  //   icon: <User size={24} />,
  //   y: 382,
  //   title: "Contact",
  // },
];

const ChatInput = ({
  openPicker,
  setOpenPicker,
  setTextMsg,
  textMsg,
  inputRef,
  handleActionClick,
}) => {
  const [openActions, setOpenActions] = React.useState(false);
  const [iamTyping, setIamTyping] = useState(false);
  const typingTimeOut = useRef();
  const current_user_id = window.localStorage.getItem("user_id");

  const { room_id } = useSelector((state) => state.app);
  const { firstName } = useSelector((state) => state.auth.userdetails);
  const { current_conversation } = useSelector(
    (state) => state.conversation.group_chat
  );
  const OnMessageChange = (e) => {
    setTextMsg(e.target.value);
    if (!iamTyping) {
      socket.emit("GROUP_CHAT_START_TYPING", {
        room_id,
        user_ids: current_conversation.participants,
        current_user_id,
        firstName,
      });
      setIamTyping(true);
    }

    if (typingTimeOut.current) clearTimeout(typingTimeOut.current);

    typingTimeOut.current = setTimeout(() => {
      socket.emit("GROUP_CHAT_STOP_TYPING", {
        room_id,
        user_ids: current_conversation.participants,
        current_user_id,
      });
      setIamTyping(false);
    }, [2000]);
  };
  return (
    <StyledInput
      fullWidth
      inputRef={inputRef}
      placeholder="Write a message..."
      variant="filled"
      value={textMsg}
      onChange={OnMessageChange}
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
              {Actions.map((el) => (
                <Tooltip placement="right" title={el.title}>
                  <Fab
                    onClick={() => {
                      handleActionClick(el.type);
                      setOpenActions(!openActions);
                    }}
                    sx={{
                      position: "absolute",
                      top: -el.y,
                      backgroundColor: el.color,
                    }}
                    aria-label="add"
                  >
                    {el.icon}
                  </Fab>
                </Tooltip>
              ))}
            </Stack>

            <InputAdornment>
              <IconButton
                onClick={() => {
                  setOpenActions(!openActions);
                }}
              >
                <LinkSimple />
              </IconButton>
            </InputAdornment>
          </Stack>
        ),
        endAdornment: (
          <Stack sx={{ position: "relative" }}>
            <InputAdornment>
              <IconButton
                onClick={() => {
                  setOpenPicker(!openPicker);
                }}
              >
                <Smiley />
              </IconButton>
            </InputAdornment>
          </Stack>
        ),
      }}
    />
  );
};

const Footer = () => {
  const theme = useTheme();

  const isMobile = useResponsive("between", "md", "xs", "sm");

  const [searchParams] = useSearchParams();

  const [openPicker, setOpenPicker] = React.useState(false);

  const { room_id } = useSelector((state) => state.app);
  const [textMsg, setTextMsg] = useState("");
  const user_id = window.localStorage.getItem("user_id");
  const inputRef = useRef(null);

  function handleEmojiClick(emoji) {
    const input = inputRef.current;

    if (input) {
      const selectionStart = input.selectionStart;
      const selectionEnd = input.selectionEnd;

      setTextMsg(
        textMsg.substring(0, selectionStart) +
          emoji +
          textMsg.substring(selectionEnd)
      );

      // Move the cursor to the end of the inserted emoji
      input.selectionStart = input.selectionEnd = selectionStart + 1;
    }
  }

  function handleActionClick(type) {
    setFileSelectionMode(type); // Set file selection mode based on action type
  }
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileSelectionMode, setFileSelectionMode] = useState(null); // State for file selection mode

  // Function to handle opening the dialog
  const handleOpenDialog = () => {
    setOpenDialog(true);
  };

  // Function to handle closing the dialog
  const handleCloseDialog = () => {
    setOpenDialog(false);
    clearSelectedFile();
  };

  // Function to handle file selection
  const handleFileSelection = (file) => {
    setSelectedFile(file);
    setOpenDialog(false); // Close the dialog after selecting the file
  };

  // Function to handle submitting the form with the selected file
  const handleSubmit = () => {
    // Here you can perform any action with the selected file
    console.log("Selected file:", selectedFile);
  };

  function clearSelectedFile() {
    setSelectedFile(null);
    setFileSelectionMode(null);
  }

  return (
    <Box
      sx={{
        position: "relative",
        backgroundColor: "transparent !important",
      }}
    >
      <Box
        p={isMobile ? 1 : 2}
        width={"100%"}
        sx={{
          backgroundColor:
            theme.palette.mode === "light"
              ? "#F8FAFF"
              : theme.palette.background.paper,
          boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
        }}
      >
        <Stack direction="row" alignItems={"center"} spacing={isMobile ? 1 : 3}>
          <Stack sx={{ width: "100%" }}>
            <Box
              style={{
                zIndex: 10,
                position: "fixed",
                display: openPicker ? "inline" : "none",
                bottom: 81,
                right: isMobile
                  ? 20
                  : searchParams.get("open") === "true"
                  ? 420
                  : 100,
              }}
            >
              <Picker
                theme={theme.palette.mode}
                data={data}
                onEmojiSelect={(e) => {
                  handleEmojiClick(e.native);
                }}
              />
            </Box>
            {/* Chat Input */}
            <ChatInput
              inputRef={inputRef}
              openPicker={openPicker}
              setOpenPicker={setOpenPicker}
              setTextMsg={setTextMsg}
              textMsg={textMsg}
              handleActionClick={handleActionClick}
            />

            <FileSelectionDialog
              open={fileSelectionMode !== null}
              fileSelectionMode={fileSelectionMode}
              onClose={handleCloseDialog}
              onDone={handleFileSelection}
              setFileSelectionMode={setFileSelectionMode}
            />
          </Stack>
          <Box
            sx={{
              height: 48,
              width: 48,
              backgroundColor: theme.palette.primary.main,
              borderRadius: 1.5,
            }}
          >
            <Stack
              sx={{ height: "100%" }}
              alignItems={"center"}
              justifyContent="center"
            >
              <IconButton
                onClick={() => {
                  if (textMsg.trim() === "") return;

                  socket.emit("send_group_message", {
                    type: containsUrl(textMsg) ? "Link" : "Text",
                    from: user_id,
                    room_id,
                    message: linkify(textMsg),
                  });

                  setTextMsg("");
                }}
              >
                <PaperPlaneTilt color="#ffffff" />
              </IconButton>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Box>
  );
};

export default Footer;
