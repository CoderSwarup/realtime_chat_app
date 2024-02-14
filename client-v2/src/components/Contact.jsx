import {
  Avatar,
  Box,
  Button,
  Divider,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import {
  BellSimpleSlash,
  CaretRight,
  Notification,
  Phone,
  Prohibit,
  Star,
  Trash,
  VideoCamera,
  X,
} from "phosphor-react";
import React from "react";
import { useDispatch } from "react-redux";
import { ToggleSideBar } from "../Redux/Slices/AppSlice";
import { faker } from "@faker-js/faker";
import AntSwitch from "./AntSwitch";

export default function Contact() {
  const theme = useTheme();
  const dispatch = useDispatch();
  return (
    <Box
      sx={{
        background: theme.palette.background.paper,
        width: 320,
        position: "absolute",
        top: 0,
        right: 0,
        height: "100vh",
      }}
    >
      <Stack sx={{ height: "100%", width: "100%" }}>
        {/* Header box */}
        <Box
          sx={{
            boxShadow: "0px 0px 2px rgba(0,0,0,0.25)",
            width: "100%",
            background:
              theme.palette.mode == "light"
                ? "#FAFAFF"
                : theme.palette.background.default,
          }}
        >
          <Stack
            sx={{ height: "100%", padding: 2 }}
            direction={"row"}
            alignItems={"center"}
            spacing={3}
            justifyContent={"space-between"}
          >
            <Typography variant="subtitle2">Contact Info</Typography>
            <IconButton
              onClick={() => {
                dispatch(ToggleSideBar());
              }}
            >
              <X />
            </IconButton>
          </Stack>
        </Box>

        {/* Main Body */}
        <Stack
          sx={{
            height: "100%",
            position: "relative",
            flexGrow: 1,
            overflowY: "scroll",
          }}
          p={3}
          spacing={3}
        >
          {/* Simple Info Name and Contact number */}
          <Stack direction={"row"} alignItems={"center"} spacing={2}>
            <Avatar
              src={faker.image.url()}
              alt={faker.person.fullName()}
            ></Avatar>

            <Stack spacing={0.5}>
              <Typography variant="article" fontWeight={600}>
                {faker.person.fullName()}
              </Typography>
              <Typography variant="body2" fontWeight={500}>
                +91 8309876545
              </Typography>
            </Stack>
          </Stack>

          {/* Calling Features */}
          <Stack
            direction={"row"}
            alignItems={"center"}
            justifyContent={"space-evenly"}
            spacing={2}
          >
            <Stack alignItems={"center"} spacing={0.5}>
              <IconButton>
                <VideoCamera />
              </IconButton>
              <Typography variant="overline"> Video</Typography>
            </Stack>
            <Stack alignItems={"center"} spacing={0.5}>
              <IconButton>
                <Phone />
              </IconButton>
              <Typography variant="overline"> Voice</Typography>
            </Stack>
          </Stack>

          {/* Divider */}
          <Divider width="100%"></Divider>

          {/* About Info */}
          <Stack spacing={1}>
            <Typography variant="article">About</Typography>
            <Typography variant="body2" fontWeight={200}>
              Only coding
            </Typography>
          </Stack>

          {/* Divider */}
          <Divider width="100%"></Divider>

          {/* Media Link Docs */}
          <Stack spacing={3}>
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
            >
              <Typography variant="subtitle">Media Links and Docs</Typography>
              <Button endIcon={<CaretRight />}>401</Button>
            </Stack>

            {/* Media Images */}

            <Stack direction={"row"} spacing={2} alignItems={"center"}>
              {[1, 2, 3].map((e) => {
                return (
                  <Box>
                    <img
                      src={faker.image.url()}
                      alt={faker.person.fullName()}
                    ></img>
                  </Box>
                );
              })}
            </Stack>

            {/* Divider */}
            <Divider width="100%"></Divider>

            {/* Starred Message */}
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              spacing={2}
            >
              <Stack direction={"row"} spacing={2} alignItems={"center"}>
                <Star size={21} />
                <Typography variant="subtitle2">Starred Message</Typography>
              </Stack>
              <IconButton>
                <CaretRight />
              </IconButton>
            </Stack>

            {/* Divider */}
            <Divider width="100%"></Divider>

            {/* Mute Notification */}
            <Stack
              direction={"row"}
              justifyContent={"space-between"}
              alignItems={"center"}
              spacing={2}
            >
              <Stack direction={"row"} spacing={2} alignItems={"center"}>
                <BellSimpleSlash size={21} />
                <Typography variant="subtitle2">Mute Notifications</Typography>
              </Stack>

              <AntSwitch />
            </Stack>

            {/* Divider */}
            <Divider width="100%"></Divider>

            <Typography variant="body1" fontWeight={700}>
              1 Group Is Comman
            </Typography>

            {/* Groups Info */}

            <Stack direction={"row"} alignItems={"center"} spacing={2}>
              <Avatar
                src={faker.image.url()}
                alt={faker.person.fullName()}
              ></Avatar>

              <Stack spacing={0.2}>
                <Typography variant="article" fontWeight={600}>
                  Toxic Sammy
                </Typography>
                <Typography variant="body2" fontWeight={500}>
                  Sam , Apa , You
                </Typography>
              </Stack>
            </Stack>

            {/* Buttons  */}
            <Stack
              direction={"row"}
              alignItems={"center"}
              justifyContent={"space-evenly"}
              spacing={2}
            >
              <Button startIcon={<Prohibit />} fullWidth variant="outlined">
                Block
              </Button>
              <Button startIcon={<Trash />} fullWidth variant="outlined">
                Delete
              </Button>
            </Stack>
          </Stack>
        </Stack>
      </Stack>
    </Box>
  );
}
