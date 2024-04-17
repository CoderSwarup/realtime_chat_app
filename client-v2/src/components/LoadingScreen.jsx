import { Box, Stack, Typography } from "@mui/material";
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
      <Typography variant="body1" fontFamily={"monospace"}>
        Loading...
      </Typography>
    </Stack>
  );
};

export default LoadingScreen;
