import React, { useState } from "react";
import { Avatar, Box, Divider, IconButton, Stack, Switch } from "@mui/material";
import Logo from "../../assets/images/logo.ico";
import { Nav_Buttons } from "../../data/index";
import { Gear } from "phosphor-react";
import { faker } from "@faker-js/faker";
import CustomizedSwitches from "../../components/CustomizeSwitch";
import { useTheme } from "@mui/material/styles";

export default function Sidebar() {
  // Main APP theme
  const theme = useTheme();

  // Selected Button
  const [selectedBtn, setSelectedBtn] = useState(0);

  console.log(theme);
  return (
    <Box
      sx={{
        background: theme.palette.background.paper,
        boxShadow: `inset 0 -1px 0 rgba(3, 3, 3, 0.872), inset 0 0 0 rgba(0, 0, 0, 0.553)`,
        height: "100vh",
        width: 100,
      }}
    >
      <Stack
        direction="column"
        sx={{ width: "100%" }}
        alignItems="center"
        spacing={4}
        justifyContent={"space-between"}
        height="100%"
      >
        <Stack alignItems="center" spacing={4}>
          <Box
            sx={{
              background: theme.palette.primary.main,
              height: 60,
              width: 60,
              borderRadius: 1.5,
            }}
            style={{ marginTop: theme.spacing(2) }} // Apply margin top using style prop
          >
            <img src={Logo} alt="Logo" />
          </Box>
          <Stack spacing={3} flexDirection="column" alignContent="center">
            {Nav_Buttons.map((button) =>
              button.index == selectedBtn ? (
                <Box
                  sx={{
                    background: theme.palette.primary.main,
                    borderRadius: 1.5,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                  key={button.index}
                >
                  {/* Render each button icon */}
                  <IconButton sx={{ width: "max-content", color: "#fff" }}>
                    {" "}
                    {button.icon}
                  </IconButton>
                </Box>
              ) : (
                <IconButton
                  onClick={() => {
                    setSelectedBtn(button.index);
                  }}
                  key={button.index}
                  sx={{
                    width: "max-content",
                    color:
                      theme.palette.mode == "light"
                        ? "#000"
                        : theme.palette.text.primary,
                  }}
                >
                  {" "}
                  {button.icon}
                </IconButton>
              )
            )}

            {/* Divider */}
            <Divider sx={{ width: 48 }}></Divider>

            {selectedBtn == 3 ? (
              <Box
                sx={{
                  background: theme.palette.primary.main,
                  borderRadius: 1.5,
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {/* Render each button icon */}
                <IconButton sx={{ width: "max-content", color: "#fff" }}>
                  {" "}
                  <Gear />
                </IconButton>
              </Box>
            ) : (
              <IconButton
                onClick={() => {
                  setSelectedBtn(3);
                }}
                sx={{
                  width: "max-content",
                  color:
                    theme.palette.mode == "light"
                      ? "#000"
                      : theme.palette.text.primary,
                }}
              >
                <Gear />
              </IconButton>
            )}
          </Stack>
        </Stack>

        {/* Bottom Section */}
        <Stack alignItems="center" spacing={3}>
          <CustomizedSwitches></CustomizedSwitches>
          <Avatar src={faker.image.avatar()}></Avatar>
        </Stack>
      </Stack>
    </Box>
  );
}
