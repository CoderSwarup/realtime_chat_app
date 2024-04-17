import { useTheme } from "@mui/material/styles";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import {
  Bell,
  Image,
  Info,
  Key,
  Keyboard,
  Lock,
  Note,
  PencilCircle,
  CaretLeft,
} from "phosphor-react";
import { faker } from "@faker-js/faker";
import Shortcuts from "../../Sections/Settings/Shortcuts";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Settings() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [openShortcuts, setOpenShortcuts] = useState(false);
  const { current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );
  const { userdetails } = useSelector((state) => state.auth);

  const handleOpenShortcuts = () => {
    setOpenShortcuts(!openShortcuts);
  };
  const handleCloseShortcuts = () => {
    setOpenShortcuts(!openShortcuts);
  };

  const Setting_Options_List = [
    {
      key: 0,
      icon: <Bell size={20} />,
      title: "Notification",
      onclick: () => {},
    },
    {
      key: 1,
      icon: <Lock size={20} />,
      title: "Privacy",
      onclick: () => {},
    },
    {
      key: 2,
      icon: <Key size={20} />,
      title: "Security",
      onclick: () => {},
    },
    {
      key: 3,
      icon: <PencilCircle size={20} />,
      title: "Theme",
      onclick: () => {},
    },
    {
      key: 4,
      icon: <Image size={20} />,
      title: "Chat Wallpaper",
      onclick: () => {},
    },
    {
      key: 5,
      icon: <Note size={20} />,
      title: "Request Account Info",
      onclick: () => {},
    },
    {
      key: 6,
      icon: <Keyboard size={20} />,
      title: "Keyboadr Shortcuts",
      onclick: handleOpenShortcuts,
    },
    {
      key: 7,
      icon: <Info size={20} />,
      title: "Help",
      onclick: () => {},
    },
  ];

  return (
    <>
      <Stack direction={"row"} sx={{ width: "100%" }}>
        {/* Left Sidebar  */}
        <Box
          className="hideScrollBar"
          sx={{
            overflowY: "scroll",
            height: "100vh",
            width: 320,
            background:
              theme.palette.mode == "light"
                ? "#F8FAFF"
                : theme.palette.background,
            boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
            border: `1px solid ${theme.palette.background.paper}`,
          }}
        >
          <Stack spacing={4} p={2}>
            {/* Header */}
            <Stack direction={"row"} alignItems={"center"} spacing={3}>
              <IconButton onClick={() => navigate(-1)}>
                <CaretLeft size={24} color="#484848" />
              </IconButton>
              <Typography variant="h5">Settings</Typography>
            </Stack>

            {/* Profile */}

            <Stack direction={"row"} alignItems={"center"} spacing={3}>
              <Avatar
                sx={{ width: 56, height: 56 }}
                src={userdetails?.avatar}
                alt={userdetails?.firstName}
              ></Avatar>
              <Stack spacing={0.5}>
                <Typography variant="article">
                  {userdetails?.firstName} {userdetails?.lastName}
                </Typography>
                <Typography variant="body2">{"About .."}</Typography>
              </Stack>
            </Stack>

            {/* Setting Options */}

            <Stack spacing={3}>
              {Setting_Options_List.map((ele) => {
                return (
                  <Stack
                    sx={{ cursor: "pointer" }}
                    key={ele.key}
                    spacing={1.5}
                    onClick={ele.onclick}
                  >
                    <Stack direction={"row"} spacing={2} alignItems={"center"}>
                      {ele.icon}
                      <Typography variant="body2">{ele.title}</Typography>
                    </Stack>
                    {ele.key !== Setting_Options_List.length - 1 && <Divider />}
                  </Stack>
                );
              })}
            </Stack>
          </Stack>
        </Box>

        {/* right Pannel */}
      </Stack>

      {/* Dialog Box */}
      {openShortcuts && (
        <Shortcuts open={openShortcuts} handleClose={handleCloseShortcuts} />
      )}
    </>
  );
}
