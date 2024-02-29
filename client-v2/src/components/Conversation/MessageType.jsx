import {
  Box,
  Divider,
  IconButton,
  Link,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { DotsThreeVertical, DownloadSimple, Image } from "phosphor-react";
import { useState } from "react";
import { Message_options } from "../../data";

export const TextMsg = ({ ele, menu }) => {
  const theme = useTheme();
  return (
    <Stack direction={"row"} justifyContent={ele.incoming ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          background: ele.incoming
            ? theme.palette.background.paper
            : theme.palette.primary.main,

          borderRadius: 1.5,
        }}
      >
        <Typography
          variant="body2"
          color={ele.incoming ? theme.palette.text : "#fff"}
        >
          {ele.message}
        </Typography>
      </Box>
      {menu && <MessagesOptions></MessagesOptions>}
    </Stack>
  );
};

export const MediaMessage = ({ ele, menu }) => {
  const theme = useTheme();
  return (
    <Stack direction={"row"} justifyContent={ele.incoming ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          background: ele.incoming
            ? theme.palette.background.paper
            : theme.palette.primary.main,

          borderRadius: 1.5,
        }}
      >
        <Stack spacing={1}>
          <img
            src={ele.img}
            alt={ele.message}
            style={{ maxHeight: 210, borderRadius: "10px" }}
          />
          <Typography variant="caption" sx={{ color: theme.palette.text }}>
            {ele.message}
          </Typography>
        </Stack>
      </Box>
      {menu && <MessagesOptions></MessagesOptions>}
    </Stack>
  );
};

export const ReplyMessage = ({ ele, menu }) => {
  const theme = useTheme();
  return (
    <Stack direction={"row"} justifyContent={ele.incoming ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          background: ele.incoming
            ? theme.palette.background.paper
            : theme.palette.primary.main,

          borderRadius: 1.5,
        }}
      >
        <Stack
          spacing={3}
          p={2}
          direction={"column"}
          alignItems={"center"}
          sx={{
            borderRadius: 2,
            background: theme.palette.background.paper,
          }}
        >
          <Typography variant="caption" sx={{ color: theme.palette.text }}>
            {ele.message}
          </Typography>
        </Stack>
        <Typography
          variant="caption"
          sx={{ color: ele.incoming ? theme.palette.text : "#fff" }}
        >
          {ele.reply}
        </Typography>
      </Box>
      {menu && <MessagesOptions></MessagesOptions>}
    </Stack>
  );
};

export const TimeLine = ({ ele }) => {
  const theme = useTheme();
  return (
    <Stack
      alignItems="center"
      direction={"row"}
      spacing={1}
      justifyContent="center"
    >
      <Divider width="47%"></Divider>
      <Typography variant="caption" sx={{ color: theme.palette.text }}>
        {ele.text}
      </Typography>
      <Divider width="47%"></Divider>
    </Stack>
  );
};

export const LinkMsg = ({ ele, menu }) => {
  const theme = useTheme();
  return (
    <Stack direction={"row"} justifyContent={ele.incoming ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          background: ele.incoming
            ? theme.palette.background.paper
            : theme.palette.primary.main,

          borderRadius: 1.5,
        }}
        width={"max-content"}
      >
        <Stack spacing={2}>
          <Stack
            p={2}
            spacing={3}
            alignItems={"start"}
            sx={{ background: theme.palette.background.paper, borderRadius: 1 }}
          >
            <img
              src={ele.preview}
              alt={ele.message}
              style={{ maxHeight: 210, borderRadius: "10px" }}
            />
            <Stack spacing={2}>
              <Typography variant="body2">Creating Chat app</Typography>
              <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.primary.main }}
                component={Link}
                to="//https://www.youtube.com"
              >
                www.youtube.com
              </Typography>
            </Stack>

            <Typography
              variant="body2"
              color={ele.incoming ? theme.palette.text : "#fff"}
            >
              <div dangerouslySetInnerHTML={{ __html: ele.message }}></div>
            </Typography>
          </Stack>
        </Stack>
      </Box>
      {menu && <MessagesOptions></MessagesOptions>}
    </Stack>
  );
};

export const DocMessage = ({ ele, menu }) => {
  const theme = useTheme();
  return (
    <Stack direction={"row"} justifyContent={ele.incoming ? "start" : "end"}>
      <Box
        p={1.5}
        sx={{
          background: ele.incoming
            ? theme.palette.background.default
            : theme.palette.primary.main,
          borderRadius: 1.5,
        }}
        width={"max-content"}
      >
        <Stack spacing={2}>
          <Stack
            p={2}
            direction={"row"}
            spacing={3}
            alignItems={"center"}
            sx={{ background: theme.palette.background.paper, borderRadius: 1 }}
          >
            <Image size={49} />
            <Typography variant="caption">png.png</Typography>
            <IconButton>
              <DownloadSimple />
            </IconButton>
          </Stack>

          <Typography
            variant="body2"
            sx={{ color: ele.incoming ? theme.palette.text : "#fff" }}
          >
            {ele.message}
          </Typography>
        </Stack>
      </Box>
      {menu && <MessagesOptions></MessagesOptions>}
    </Stack>
  );
};

export const MessagesOptions = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <DotsThreeVertical
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        size={22}
      />

      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        <Stack spacing={1} p={1}>
          {Message_options.map((ele, i) => {
            return (
              <MenuItem key={i} onClick={handleClose}>
                {ele.title}
              </MenuItem>
            );
          })}
        </Stack>
      </Menu>
    </>
  );
};
