import React from "react";
import {
  Box,
  IconButton,
  InputAdornment,
  Stack,
  TextField,
  useTheme,
} from "@mui/material";
import { LinkSimple, PaperPlaneTilt, Smiley } from "phosphor-react";
import styled from "@emotion/styled";

const StyledInput = styled(TextField)(({ theme }) => ({
  "& .MuiBadge-badge": {
    paddingTop: "12px",
    paddingBottom: "12px",
  },
}));

export default function Footer() {
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
  );
}
