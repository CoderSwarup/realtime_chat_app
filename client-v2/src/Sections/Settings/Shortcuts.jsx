import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Slide,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";
import { Keyboard_Shortcuts } from "../../data";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
export default function Shortcuts({ open, handleClose }) {
  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        aria-labelledby="Shortcut-dialog"
        aria-describedby="Keyboard-Shortcuts"
        keepMounted
        sx={{ padding: 1 }}
        TransitionComponent={Transition}
      >
        <DialogTitle>KeyBoard Shortcuts</DialogTitle>
        <DialogContent className="hideScrollBar" sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            {Keyboard_Shortcuts.map(({ key, title, combination }) => {
              return (
                <Grid key={key} container item xs={6}>
                  <Stack
                    sx={{ width: "100%" }}
                    direction={"row"}
                    spacing={2}
                    alignItems={"center"}
                    justifyContent={"space-between"}
                  >
                    <Typography variant="caption" sx={{ fontSize: 14 }}>
                      {title}
                    </Typography>
                    <Stack spacing={1} direction={"row"} alignItems={"center"}>
                      {combination.map((shortcut) => {
                        return (
                          <Button
                            disabled
                            variant="contained"
                            sx={{ color: "#212121" }}
                          >
                            {shortcut}
                          </Button>
                        );
                      })}
                    </Stack>
                  </Stack>
                </Grid>
              );
            })}
          </Grid>
        </DialogContent>

        <DialogActions>
          {" "}
          <Button variant="contained" onClick={handleClose}>
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
