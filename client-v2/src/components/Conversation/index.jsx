import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { faker } from "@faker-js/faker";
import {
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  CaretDown,
  LinkSimple,
  MagnifyingGlass,
  PaperPlaneTilt,
  PhoneCall,
  Smiley,
  VideoCamera,
} from "phosphor-react";
import React from "react";

const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiBadge-badge": {
    paddingTop: "12px",
    paddingBottom: "12px",
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    backgroundColor: "#44b700",
    color: "#44b700",
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    "&::after": {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      borderRadius: "50%",
      animation: "ripple 1.2s infinite ease-in-out",
      border: "1px solid currentColor",
      content: '""',
    },
  },
  "@keyframes ripple": {
    "0%": {
      transform: "scale(.8)",
      opacity: 1,
    },
    "100%": {
      transform: "scale(2.4)",
      opacity: 0,
    },
  },
}));

export default function Conversation() {
  const theme = useTheme();
  return (
    <Stack height="100%" maxHeight="100vh" width="auto">
      {/* Chat Header */}
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
              <Typography variant="subtitle2">
                {faker.name.fullName()}
              </Typography>
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

      {/* Conversation MSG */}
      <Box sx={{ height: "100%", width: "100%" }} flexGrow={1}></Box>

      {/* Footer */}
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
          <StyledInput
            fullWidth
            placeholder="Write a Message......."
            variant="filled"
            InputProps={{
              disableUnderline: true,
              startAdornment: (
                <InputAdornment>
                  <IconButton>
                    <LinkSimple></LinkSimple>
                  </IconButton>
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment>
                  <IconButton>
                    <Smiley />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

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
              <IconButton>
                <PaperPlaneTilt color="#fff" />
              </IconButton>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </Stack>
  );
}
