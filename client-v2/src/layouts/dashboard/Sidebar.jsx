import React, { useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Switch,
} from "@mui/material";
import Logo from "../../assets/images/logo.ico";
import { Nav_Buttons, Profile_Menu } from "../../data/index";
import { Gear } from "phosphor-react";
import { faker } from "@faker-js/faker";
import CustomizedSwitches from "../../components/CustomizeSwitch";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";

const Get_MenuItem_Path = (index) => {
  switch (index) {
    case 0:
      return "/profile";
    case 1:
      return "/settings";
    case 2:
      return "/auth/login";

    default:
      "/app";
  }
};

const GetRedirectPath = (index) => {
  switch (index) {
    case 0:
      return "/app";
    case 1:
      return "/group";
    case 2:
      return "/call";
    case 3:
      return "/settings";
    default:
      "/app";
  }
};

export default function Sidebar() {
  // Main APP theme
  const theme = useTheme();

  //Navigate Hook
  const navigate = useNavigate();

  // Selected Button
  const [selectedBtn, setSelectedBtn] = useState(0);

  // console.log(theme);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

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
                    navigate(GetRedirectPath(button.index));
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
                  navigate(GetRedirectPath(3));
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
        <Stack alignItems="center" spacing={3} pb={2}>
          <CustomizedSwitches></CustomizedSwitches>
          <Avatar
            id="basic-button"
            aria-controls={open ? "basic-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
            onClick={handleClick}
            sx={{ cursor: "pointer" }}
            src={faker.image.avatar()}
          ></Avatar>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "bottom",
              horizontal: "left",
            }}
          >
            <Stack spacing={1} p={1}>
              {Profile_Menu.map((ele, i) => {
                return (
                  <MenuItem key={i} onClick={handleClose}>
                    <Stack
                      onClick={() => {
                        navigate(Get_MenuItem_Path(i));
                      }}
                      sx={{ width: 80 }}
                      direction={"row"}
                      alignItems={"center"}
                      justifyContent={"space-between"}
                    >
                      <span>{ele.title}</span>
                      {ele.icon}
                    </Stack>
                  </MenuItem>
                );
              })}
            </Stack>
          </Menu>
        </Stack>
      </Stack>
    </Box>
  );
}
