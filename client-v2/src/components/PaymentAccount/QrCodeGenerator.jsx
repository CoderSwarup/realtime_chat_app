import { useTheme } from "@emotion/react";
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
import React, { useRef } from "react";
import { QRCode } from "react-qrcode-logo";
import useResponsive from "../../hooks/useResponsive";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function QrCodeGenerator({ open, handleClose, qrData }) {
  const isMobile = useResponsive("between", "md", "xs", "sm");
  const qrValue = JSON.stringify(qrData);
  const theme = useTheme();
  const logoSrc = "/logo.jpg"; // Replace with your logo path
  const canvasRef = useRef(null);

  const downloadQRCode = () => {
    const canvas = canvasRef.current.querySelector("canvas");
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = "qrcode.png";
    a.click();
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        aria-labelledby="qrcode-dialog"
        aria-describedby="qr-code-generation"
        keepMounted
        sx={{ padding: 1 }}
        TransitionComponent={Transition}
      >
        <DialogTitle>QR Code Generator</DialogTitle>
        <DialogContent className="hideScrollBar" sx={{ mt: 4 }}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Box ref={canvasRef} display="flex" justifyContent="center">
                <QRCode value={qrValue} size={isMobile ? 100 : 300} />
              </Box>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleClose}>
            Close
          </Button>
          <Button variant="contained" onClick={downloadQRCode}>
            Download QR Code
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
