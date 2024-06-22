import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Switch,
  Tooltip,
} from "@mui/material";
import Logo from "../../assets/Images/logo.ico";
import { Nav_Buttons, Profile_Menu } from "../../data/index";
import { CaretCircleLeft, Gear, TextIndent } from "phosphor-react";
import { faker } from "@faker-js/faker";
import CustomizedSwitches from "../../components/CustomizeSwitch";
import { useTheme } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LogOutUser } from "../../Redux/Slices/AuthSlice";
import { useSelector } from "react-redux";
import { SelectConversation } from "../../Redux/Slices/AppSlice";
import {
  SetCurrentConversation,
  SetCurrentGroupConversation,
} from "../../Redux/Slices/ConversationSlice";
import useResponsive from "../../hooks/useResponsive";
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
      return "/story";
    case 4:
      return "/account-dashboard";
    case 5:
      return "/settings";
    default:
      "/app";
  }
};

export default function Sidebar() {
  const isMobile = useResponsive("between", "md", "xs", "sm");
  const dispatch = useDispatch();
  const [sidebar, setSidebar] = useState(true);
  // Main APP theme
  const theme = useTheme();

  //Navigate Hook
  const navigate = useNavigate();

  // Selected Button
  const [selectedBtn, setSelectedBtn] = useState(0);
  const { chat_type } = useSelector((s) => s.app);
  // console.log(theme);

  const { userdetails } = useSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    if (chat_type === "individual") {
      setSelectedBtn(0);
      navigate("/app");
    } else if (chat_type === "group_chat") {
      setSelectedBtn(1);
      navigate("/group");
    } else {
      setSelectedBtn(0);
      navigate("/app");
    }
  }, []);

  return (
    <Box
      sx={{
        position: {
          xs: "absolute",
          md: "relative",
        },
        left: {
          xs: sidebar ? -100 : 0,
          md: 0,
        },
        zIndex: 2,
        background: theme.palette.background.paper,
        boxShadow: `inset 0 -1px 0 rgba(3, 3, 3, 0.872), inset 0 0 0 rgba(0, 0, 0, 0.553)`,
        height: "100vh",
        width: 100,
      }}
    >
      <Box
        display={{
          xs: "block",
          md: "none",
        }}
        sx={{
          position: "absolute",
          top: 0,
          right: sidebar ? -40 : -20,
        }}
      >
        <IconButton onClick={() => setSidebar(!sidebar)}>
          {sidebar ? <TextIndent size={25} /> : <CaretCircleLeft size={25} />}
        </IconButton>
      </Box>
      <Stack
        direction="column"
        sx={{ width: "100%", overflowY: "hidden" }}
        alignItems="center"
        spacing={4}
        justifyContent={"space-between"}
        height="100%"
      >
        <Stack alignItems="center" spacing={4}>
          <Box
            sx={{
              background: theme.palette.primary.main,
              height: {
                xs: 40,
                md: 60,
              },
              width: {
                xs: 40,
                md: 60,
              },
              borderRadius: 1.5,
            }}
            style={{ marginTop: theme.spacing(2) }} // Apply margin top using style prop
          >
            <img src={Logo} alt="Logo" />
          </Box>
          <Stack spacing={3} flexDirection="column" alignContent="center">
            {Nav_Buttons.map((button) =>
              button.index == selectedBtn ? (
                <Tooltip
                  title={button?.title}
                  placement="right"
                  key={button.index}
                >
                  <IconButton
                    sx={{
                      width: "max-content",
                      color: "#fff",
                      background: theme.palette.primary.main,
                      borderRadius: 1.5,
                    }}
                  >
                    {" "}
                    {button.icon}
                  </IconButton>
                </Tooltip>
              ) : (
                <Tooltip
                  title={button?.title}
                  placement="right"
                  key={button.index}
                >
                  <IconButton
                    onClick={() => {
                      setSidebar(true);
                      setSelectedBtn(button.index);
                      navigate(GetRedirectPath(button.index));
                      dispatch(
                        SelectConversation({ room_id: null, chat_type: null })
                      );
                      dispatch(SetCurrentConversation(null));
                      dispatch(SetCurrentGroupConversation(null));
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
                </Tooltip>
              )
            )}

            {/* Divider */}
            <Divider sx={{ width: 48 }}></Divider>

            {selectedBtn == 5 ? (
              <Tooltip title="Settings" placement="right">
                <IconButton
                  sx={{
                    width: "max-content",
                    color: "#fff",
                    background: theme.palette.primary.main,
                    borderRadius: 1.5,
                  }}
                >
                  {" "}
                  <Gear size={20} />
                </IconButton>
              </Tooltip>
            ) : (
              <Tooltip title="Settings" placement="right">
                <IconButton
                  onClick={() => {
                    setSelectedBtn(5);
                    navigate(GetRedirectPath(5));
                    setSidebar(true);
                  }}
                  sx={{
                    width: "max-content",
                    color:
                      theme.palette.mode == "light"
                        ? "#000"
                        : theme.palette.text.primary,
                  }}
                >
                  <Gear size={20} />
                </IconButton>
              </Tooltip>
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
            src={userdetails?.avatar}
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
                        if (i === 2) {
                          dispatch(LogOutUser());
                        } else {
                          navigate(Get_MenuItem_Path(i));
                        }
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
