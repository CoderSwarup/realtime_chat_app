import { faker } from "@faker-js/faker";
import {
  Avatar,
  Box,
  IconButton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";
import StyledBadge from "./Conversation/StyledBadge";
import {
  ArrowDownLeft,
  ArrowUpRight,
  PhoneCall,
  VideoCamera,
} from "phosphor-react";

export function CallLogElement({ online, incoming, missed }) {
  const theme = useTheme();
  return (
    <>
      <Box
        sx={{
          width: "100%",
          borderRadius: 1,
          height: 60,
          background:
            theme.palette.mode == "light"
              ? "#F8FAFE"
              : theme.palette.background.paper,
        }}
        p={1}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          spacing={2}
        >
          <Stack direction={"row"} spacing={2}>
            {online ? (
              <StyledBadge
                variant="dot"
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              >
                <Avatar src={faker.image.url()}></Avatar>
              </StyledBadge>
            ) : (
              <Avatar src={faker.image.url()}></Avatar>
            )}
            <Stack spacing={0.5}>
              <Typography variant="body2">{faker.person.fullName()}</Typography>
              <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                {incoming ? (
                  <ArrowDownLeft color={missed ? "red" : "green"} />
                ) : (
                  <ArrowUpRight color={missed ? "red" : "green"} />
                )}
                <Typography variant="caption">Yesterday 12:23</Typography>
              </Stack>
            </Stack>
          </Stack>

          <IconButton>
            <PhoneCall size={25} color="green" />
          </IconButton>
        </Stack>
      </Box>
    </>
  );
}

export function CallElement({ online, img, name }) {
  const theme = useTheme();
  return (
    <>
      <Box
        sx={{
          width: "100%",
          borderRadius: 1,
          height: 60,
          background:
            theme.palette.mode == "light"
              ? "#F8FAFE"
              : theme.palette.background.paper,
        }}
        p={1}
      >
        <Stack
          direction={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
          spacing={2}
        >
          <Stack direction={"row"} spacing={3}>
            {online ? (
              <StyledBadge
                variant="dot"
                overlap="circular"
                anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              >
                <Avatar src={img}></Avatar>
              </StyledBadge>
            ) : (
              <Avatar src={img}></Avatar>
            )}
            <Stack spacing={0.5}>
              <Typography variant="body2">{name}</Typography>
              <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                <Typography variant="caption">Yesterday 12:23</Typography>
              </Stack>
            </Stack>
          </Stack>

          <Stack direction={"row"} alignItems={"center"} spacing={1}>
            <IconButton>
              <PhoneCall size={25} color="green" />
            </IconButton>
            <IconButton>
              <VideoCamera size={25} color="green" />
            </IconButton>
          </Stack>
        </Stack>
      </Box>
    </>
  );
}
