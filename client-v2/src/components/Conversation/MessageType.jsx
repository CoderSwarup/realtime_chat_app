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
import { DotsThreeVertical, DownloadSimple, File, Image } from "phosphor-react";
import { useEffect, useState } from "react";
import { Message_options } from "../../data";
import fetchLinkPreview from "../../utils/LinkPreview";
import { socket } from "../../Socket";
import { useDispatch, useSelector } from "react-redux";
import { DeleteMessage } from "../../Redux/Slices/ConversationSlice";
import { ShowSnackbar } from "../../Redux/Slices/AppSlice";

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
      {menu && <MessagesOptions msg={ele}></MessagesOptions>}
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
      {menu && <MessagesOptions msg={ele}></MessagesOptions>}
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
      {menu && <MessagesOptions msg={ele}></MessagesOptions>}
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
  const [preview, setPreview] = useState({});
  useEffect(() => {
    const regex = /href="([^"]*)"/; // Regular expression to match href attribute
    const match = ele.message.match(regex);
    if (match) {
      const href = match[1]; // Extracted href value
      setPreview({
        title: href,
        image: "",
        url: href,
      });

      // get all The Preview of the Link
      // fetchLinkPreview(href).then((preview) => {
      //   // console.log("Link Preview:", preview);
      //   setPreview(preview);
      // });
    }
  }, [ele]);

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
              src={preview?.image}
              alt={preview?.title}
              style={{ maxWidth: 300, maxHeight: 210, borderRadius: "10px" }}
            />
            <Stack spacing={2}>
              {/* <Typography variant="body2">Creating Chat app</Typography> */}
              <Typography
                variant="subtitle2"
                sx={{ color: theme.palette.primary.main }}
                component={Link}
                to={preview?.url}
              >
                {preview?.title}
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
      {menu && <MessagesOptions msg={ele}></MessagesOptions>}
    </Stack>
  );
};

export const DocMessage = ({ ele, menu }) => {
  const theme = useTheme();

  const downloadFile = (url, filename) => {
    // Create a temporary anchor tag
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", filename); // Set the download attribute (HTML5)
    document.body.appendChild(link); // Append to the document to make it work on Firefox
    link.click(); // Programmatically click the link to trigger the download
    document.body.removeChild(link); // Remove the link when done
  };
  return (
    <Stack direction={"row"} justifyContent={ele.incoming ? "start" : "end"}>
      <Box
        p={1}
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
            <File size={20} />
            <Typography variant="caption">
              {ele?.file?.public_id.replace("Talk_Live/", "") || "FILE"}
            </Typography>
            <IconButton
              onClick={() => {
                downloadFile(ele?.file.url, ele?.file.public_id);
              }}
            >
              <DownloadSimple size={20} />
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
      {menu && <MessagesOptions msg={ele}></MessagesOptions>}
    </Stack>
  );
};

export const MessagesOptions = ({ msg }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const dispatch = useDispatch();
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const { room_id } = useSelector((state) => state.app);
  const user_id = localStorage.getItem("user_id");

  const { chat_type } = useSelector((state) => state.app);
  const handleType = (id) => {
    switch (id) {
      case 5:
        delMessage();

        break;
      default:
        handleClose();
    }
  };

  // delete essage
  const delMessage = async () => {
    if (!window.confirm("Are you sure to delete this message?")) {
      handleClose();
      return;
    }
    if (chat_type === "individual") {
      socket.emit(
        "delete_message",
        {
          conversation_id: room_id,
          message_id: msg.id,
          from: user_id,
        },
        (data) => {
          dispatch(ShowSnackbar("success", data));
        }
      );
    } else if (chat_type === "group_chat") {
      socket.emit(
        "delete_group_message",
        {
          room_id,
          message_id: msg.id,
          from: user_id,
        },
        (data) => {
          dispatch(ShowSnackbar("success", data));
        }
      );
    }

    handleClose();
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
              <MenuItem
                key={i}
                onClick={() => {
                  handleType(i);
                }}
              >
                {ele.title}
              </MenuItem>
            );
          })}
        </Stack>
      </Menu>
    </>
  );
};
