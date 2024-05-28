import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import React from "react";

const LoadingScreen = () => {
  return (
    <Stack
      direction={"column"}
      sx={{
        width: "100%",
        height: "100vh",
      }}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <CircularProgress />
    </Stack>
  );
};

export default LoadingScreen;
