import React from "react";
import {
  Avatar,
  Badge,
  Box,
  Divider,
  Fade,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  styled,
  Typography,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import {
  CaretDown,
  MagnifyingGlass,
  Phone,
  CaretLeft,
  VideoCamera,
} from "phosphor-react";
import { faker } from "@faker-js/faker";
import { useSearchParams } from "react-router-dom";
import useResponsive from "../../hooks/useResponsive";
import { useSelector } from "react-redux";
import {
  SelectConversation,
  ToggleSideBar,
  UpdateSidebarType,
} from "../../Redux/Slices/AppSlice";
import { SetCurrentGroupConversation } from "../../Redux/Slices/ConversationSlice";
import { useDispatch } from "react-redux";
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

const Conversation_Menu = [
  {
    title: "Group info",
  },
  {
    title: "Mute notifications",
  },
  {
    title: "Clear messages",
  },
  {
    title: "Delete chat",
  },
];

const ChatHeader = () => {
  const isMobile = useResponsive("between", "md", "xs", "sm");
  const [searchParams, setSearchParams] = useSearchParams();
  const theme = useTheme();
  const dispatch = useDispatch();
  const [conversationMenuAnchorEl, setConversationMenuAnchorEl] =
    React.useState(null);
  const openConversationMenu = Boolean(conversationMenuAnchorEl);
  const handleClickConversationMenu = (event) => {
    setConversationMenuAnchorEl(event.currentTarget);
  };

  const handleCloseConversationMenu = (i) => {
    switch (i) {
      case 0:
        dispatch(ToggleSideBar());
        dispatch(UpdateSidebarType("CONTACT"));
        break;
    }
    setConversationMenuAnchorEl(null);
  };

  const { current_conversation } = useSelector(
    (s) => s.conversation.group_chat
  );

  return (
    <Box
      p={2}
      width={"100%"}
      sx={{
        backgroundColor:
          theme.palette.mode === "light"
            ? "#F8FAFF"
            : theme.palette.background.paper,
        boxShadow: "0px 0px 2px rgba(0, 0, 0, 0.25)",
      }}
    >
      <Stack
        alignItems={"center"}
        direction={"row"}
        sx={{ width: "100%", height: "100%" }}
        justifyContent="space-between"
      >
        <Stack direction={"row"} spacing={2}>
          <IconButton
            onClick={() => {
              dispatch(SelectConversation({ room_id: null, chat_type: null }));
              dispatch(SetCurrentGroupConversation(null));
              // dispatch(FetchCurrentMessages({ messages: [] }));
            }}
          >
            <CaretLeft />
          </IconButton>

          <Stack
            onClick={() => {
              dispatch(ToggleSideBar());
              dispatch(UpdateSidebarType("CONTACT"));
            }}
            direction={"row"}
            spacing={2}
          >
            <Avatar
              src={current_conversation?.img}
              alt={current_conversation?.name}
            ></Avatar>

            <Stack spacing={0.2}>
              <Typography variant="subtitle2">
                {current_conversation?.name}
              </Typography>
              <Typography variant="caption">About ....</Typography>
            </Stack>
          </Stack>
        </Stack>
        <Stack direction={"row"} alignItems="center" spacing={isMobile ? 1 : 3}>
          <IconButton>
            <VideoCamera />
          </IconButton>
          <IconButton>
            <Phone />
          </IconButton>
          {!isMobile && (
            <IconButton>
              <MagnifyingGlass />
            </IconButton>
          )}

          <Divider orientation="vertical" flexItem />
          <IconButton
            id="conversation-positioned-button"
            aria-controls={
              openConversationMenu ? "conversation-positioned-menu" : undefined
            }
            aria-haspopup="true"
            aria-expanded={openConversationMenu ? "true" : undefined}
            onClick={handleClickConversationMenu}
          >
            <CaretDown />
          </IconButton>
          <Menu
            MenuListProps={{
              "aria-labelledby": "fade-button",
            }}
            TransitionComponent={Fade}
            id="conversation-positioned-menu"
            aria-labelledby="conversation-positioned-button"
            anchorEl={conversationMenuAnchorEl}
            open={openConversationMenu}
            onClose={handleCloseConversationMenu}
            anchorOrigin={{
              vertical: "bottom",
              horizontal: "right",
            }}
            transformOrigin={{
              vertical: "top",
              horizontal: "right",
            }}
          >
            <Box p={1}>
              <Stack spacing={1}>
                {Conversation_Menu.map((el, i) => (
                  <MenuItem onClick={() => handleCloseConversationMenu(i)}>
                    <Stack
                      sx={{ minWidth: 100 }}
                      direction="row"
                      alignItems={"center"}
                      justifyContent="space-between"
                    >
                      <span>{el.title}</span>
                    </Stack>{" "}
                  </MenuItem>
                ))}
              </Stack>
            </Box>
          </Menu>
        </Stack>
      </Stack>
    </Box>
  );
};

export default ChatHeader;
