import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Input,
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { ShowSnackbar } from "../../Redux/Slices/AppSlice";
import { socket } from "../../Socket";

const FileSelectionDialog = ({
  open,
  onClose,
  onDone,
  setFileSelectionMode,
  fileSelectionMode,
}) => {
  const dispacth = useDispatch();

  const user_id = window.localStorage.getItem("user_id");

  const { room_id } = useSelector((state) => state.app);
  const { current_conversation } = useSelector(
    (state) => state.conversation.direct_chat
  );

  const [selectedFile, setSelectedFile] = useState(null);

  // Function to handle file selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file.size > 10485760) {
      return dispacth(ShowSnackbar("error", "File Size is Too Big!!"));
    }
    setSelectedFile(file);
  };

  // Function to render different previews based on file type
  const renderPreview = () => {
    if (!selectedFile) return null;

    const fileType = selectedFile.type.split("/")[0]; // Get the file type (e.g., image, video)
    if (fileType === "image") {
      return (
        <img
          src={URL.createObjectURL(selectedFile)}
          alt="Preview"
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        />
      );
    } else if (fileType === "video") {
      return (
        <video controls style={{ maxWidth: "100%", maxHeight: "100%" }}>
          <source
            src={URL.createObjectURL(selectedFile)}
            type={selectedFile.type}
          />
        </video>
      );
    } else {
      return <Typography variant="body1">{selectedFile.name}</Typography>; // Display file name if it's not an image or video
    }
  };
  const handleClose = () => {
    onClose();
    setFileSelectionMode(null); // Reset selected file state after sending
    setSelectedFile(null);
  };
  // Function to handle "Done" button click
  const handleDoneClick = () => {
    // Emit the file to the backend
    if (fileSelectionMode && selectedFile) {
      socket.emit("media_message", {
        file: selectedFile,
        filename: selectedFile.name,
        conversation_id: room_id,
        from: user_id,
        to: current_conversation.user_id,
      });
      onDone(selectedFile);
      setFileSelectionMode(null); // Reset selected file state after sending
      setSelectedFile(null);
    }
  };

  return (
    <Dialog maxWidth="xs" fullWidth open={open} onClose={onClose}>
      <DialogTitle>Selected {fileSelectionMode} File Preview</DialogTitle>
      <DialogContent>
        <Input
          type="file"
          accept="image/*, video/*"
          onChange={handleFileChange}
          sx={{ display: "none" }} // Hide the default file input
          id="file-input" // Add an id to associate with the label
        />
        <label htmlFor="file-input">
          <Button variant="contained" component="span">
            Select File
          </Button>
        </label>
        {renderPreview()}
      </DialogContent>

      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={() => {
            onClose();
            handleDoneClick();
          }}
          disabled={!selectedFile}
        >
          Send File
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default FileSelectionDialog;
