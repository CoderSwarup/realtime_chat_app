import React from "react";
import { useTheme } from "@emotion/react";

import { faker } from "@faker-js/faker";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import {
  CaretDown,
  MagnifyingGlass,
  PhoneCall,
  VideoCamera,
} from "phosphor-react";
import StyledBadge from "./StyledBadge";

export default function Header() {
  const theme = useTheme();
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
      <Stack
        direction={"row"}
        justifyContent={"space-between"}
        alignItems={"center"}
        sx={{ height: "100%", width: "100%" }}
      >
        {/* Left avatar */}
        <Stack direction={"row"} spacing={2}>
          <StyledBadge
            overlap="circular"
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            variant="dot"
          >
            <Avatar
              src={faker.image.avatar()}
              alt={faker.name.fullName()}
            ></Avatar>
          </StyledBadge>
          <Stack spacing={0.2}>
            <Typography variant="subtitle2">{faker.name.fullName()}</Typography>
            <Typography variant="caption">ONLINE</Typography>
          </Stack>
        </Stack>
        {/* Right Side Icons*/}
        <Stack direction={"row"} alignItems={"center"} spacing={1}>
          <IconButton>
            <VideoCamera></VideoCamera>
          </IconButton>
          <IconButton>
            <PhoneCall />
          </IconButton>
          <IconButton>
            <MagnifyingGlass />
          </IconButton>

          <Divider orientation="vertical" flexItem></Divider>

          <IconButton>
            <CaretDown />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
}
