import React, { useEffect, useState } from "react";
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
  TextField,
  MenuItem,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
} from "@mui/material";

import { useDispatch, useSelector } from "react-redux";
import { GetFriendsAccount } from "../../Redux/Slices/PaymentSlice";
import { useNavigate } from "react-router-dom";
import QrScanner from "react-qr-scanner";
import { CheckCircle as CheckCircleOutlineIcon } from "phosphor-react";
import { usePaymentPasswordValidation } from "../../hooks/usePaymentPasswordValidation";
import PaymentPassword from "./PaymentPassword/PaymentPassword";
import { ShowSnackbar } from "../../Redux/Slices/AppSlice";
import AxiosInstance from "../../utils/Axios";

// Transition for Dialog
const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

// Fake friends data
const friendsData = [
  { id: 1, name: "John Doe", accountId: "12345" },
  { id: 2, name: "Jane Smith", accountId: "67890" },
];

const SendMoney = ({ open, handleClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAccountPresent, friendsAccount, accountDetails } = useSelector(
    (state) => state.payment
  );
  const { token } = useSelector((state) => state.auth);
  const {
    isPasswordCorrect,
    handlePasswordSubmit,
    loading: paymentPinLoader,
  } = usePaymentPasswordValidation();
  const [selectedFriend, setSelectedFriend] = useState("");
  const [amount, setAmount] = useState("");
  const [tabIndex, setTabIndex] = useState(0);
  const [qrResult, setQrResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [accountPresent, setAccountPresent] = useState(true);
  const [paymentSuccess, setPaymentSuccess] = useState(false); // Track payment success
  const [showPaymentPin, setShowPaymentPin] = useState(false); // Toggle for showing payment PIN dialog
  const [cameraPermissionError, setCameraPermissionError] = useState(false);
  const [TransactionSuccess, setTransactionSuccess] = useState(false);
  const [MainLoader, setMainLoader] = useState(false);
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  const handleTransferMoney = () => {
    if ((tabIndex === 0 && qrResult) || (tabIndex === 1 && selectedFriend)) {
      if (amount <= 0 || !amount) {
        dispatch(ShowSnackbar("warning", "Please enter Valid Details"));
        return;
      }

      setShowPaymentPin(true); // Show payment PIN dialog after QR scan or friend selection
    }
  };

  const handlePaymentSuccessClose = () => {
    setPaymentSuccess(false);
    setAmount("");
    setQrResult("");
    setSelectedFriend("");
    setTabIndex(0);
    handleClose();
  };

  const handleQrScan = (data) => {
    if (data) {
      const scannedData = JSON.parse(data.text);
      if (!scannedData.accountId || scannedData.accountId === "") return;
      setQrResult(scannedData);
      setIsLoading(true);
      setTimeout(() => {
        setAccountPresent(true);
        setIsLoading(false);
      }, 2000);
    }
  };

  const handleQrError = (err) => {
    console.error(err);
    if (err?.name === "NotAllowedError") {
      setCameraPermissionError(true); // Set camera permission error flag
    }
  };

  const handleEnableCamera = (e) => {
    e.preventDefault();
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraPermissionError(true);
      console.error("getUserMedia is not supported in this browser.");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        // Camera permission granted
        console.log("Camera permission granted.");
        stream.getTracks().forEach((track) => track.stop());
      })
      .catch((err) => {
        console.error("Error accessing camera:", err);
        setCameraPermissionError(true);
      });
  };

  useEffect(() => {
    if (isAccountPresent) {
      dispatch(GetFriendsAccount());
    }
  }, []);
  const MakeTransaction = async () => {
    setMainLoader(true);
    const Amount = Number(amount);
    const from = accountDetails?._id;
    let to = "";
    if (selectedFriend) {
      to = selectedFriend?._id;
    } else if (qrResult) {
      to = qrResult?.accountId;
    }

    if (!to || to.toString().trim() == "" || !from) {
      setMainLoader(false);
      console.log(paymentSuccess);

      dispatch(ShowSnackbar("info", "Something Wrong Please Try Again"));
      return;
    }

    try {
      const data = await AxiosInstance.post(
        "/account/transfer",
        {
          amount: Amount,
          from: from,
          to: to,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTransactionSuccess(true);
      dispatch(ShowSnackbar("success", data.data.message));
    } catch (err) {
      dispatch(ShowSnackbar("error", err.response.data.error));
    }
    setMainLoader(false);
  };

  useEffect(() => {
    if (paymentSuccess === true) {
      MakeTransaction();
    }
  }, [paymentSuccess]);

  if (!isAccountPresent) {
    return (
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        aria-labelledby="Account Not Active"
        keepMounted
        TransitionComponent={Transition}
      >
        <DialogTitle>Account Not Active</DialogTitle>
        <DialogContent className="hideScrollBar" sx={{ mt: 4 }}>
          <p>
            Your payment account is not active. Please activate your account to
            access all features and manage your transactions seamlessly.
          </p>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => navigate("/account-dashboard")}
            color="primary"
            variant="contained"
          >
            Go to Account Dashboard
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        aria-labelledby="send-money-dialog"
        keepMounted
      >
        <DialogTitle>Send Money</DialogTitle>
        <DialogContent className="hideScrollBar">
          {MainLoader ? (
            <Stack justifyContent={"center"} alignItems={"center"} my={4}>
              <CircularProgress />
            </Stack>
          ) : paymentSuccess && TransactionSuccess ? (
            <Box display="flex" flexDirection="column" alignItems="center">
              <CheckCircleOutlineIcon
                style={{ color: "green", fontSize: 60 }}
              />
              <Typography variant="h6" color="success.main" sx={{ mt: 2 }}>
                Payment Successful!
              </Typography>
              <Button
                variant="contained"
                onClick={handlePaymentSuccessClose}
                sx={{ mt: 2 }}
              >
                Close
              </Button>
            </Box>
          ) : showPaymentPin ? (
            <Stack my={3}>
              <PaymentPassword
                onSubmit={(password) => {
                  handlePasswordSubmit(
                    password,
                    setPaymentSuccess,
                    setShowPaymentPin
                  );
                }}
                loading={paymentPinLoader}
              />
            </Stack>
          ) : (
            <>
              <Tabs value={tabIndex} onChange={handleTabChange} centered>
                <Tab label="Scan and Pay" />
                <Tab label="Select Friend" />
              </Tabs>
              {tabIndex === 0 && (
                <Box sx={{ mt: 2 }} width={"100%"} textAlign={"center"}>
                  {isLoading ? (
                    <CircularProgress />
                  ) : accountPresent ? (
                    <>
                      {cameraPermissionError && (
                        <Box sx={{ mt: 2 }} width={"100%"} textAlign={"center"}>
                          <Typography color="error">
                            Camera permission denied.
                          </Typography>
                          <Button
                            variant="contained"
                            onClick={handleEnableCamera}
                            sx={{ mt: 2 }}
                          >
                            Enable Camera
                          </Button>
                        </Box>
                      )}
                      <QrScanner
                        delay={300}
                        onError={handleQrError}
                        onScan={handleQrScan}
                        style={{ width: "100%" }}
                      />
                      {qrResult && (
                        <>
                          <TextField
                            fullWidth
                            label="Account ID"
                            value={qrResult.accountId}
                            InputProps={{ readOnly: true }}
                            sx={{ mt: 2 }}
                          />
                          <TextField
                            type="number"
                            fullWidth
                            label="Amount"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value)}
                            sx={{ mt: 2 }}
                          />
                          <Button
                            variant="contained"
                            onClick={handleTransferMoney}
                            sx={{ mt: 2 }}
                          >
                            Transfer Money
                          </Button>
                        </>
                      )}
                    </>
                  ) : (
                    <Typography color="error" sx={{ mt: 2 }}>
                      QR ID Account Not Available
                    </Typography>
                  )}
                </Box>
              )}
              {tabIndex === 1 && (
                <>
                  {friendsAccount.length > 0 ? (
                    <Grid container spacing={3} sx={{ mt: 2 }}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          select
                          label="Select Friend"
                          value={selectedFriend}
                          onChange={(e) => setSelectedFriend(e.target.value)}
                        >
                          {friendsAccount.map((friend) => (
                            <MenuItem key={friend.id} value={friend}>
                              {friend.user.firstName +
                                " " +
                                friend.user.lastName}
                            </MenuItem>
                          ))}
                        </TextField>
                      </Grid>
                      {selectedFriend && (
                        <>
                          <Grid item xs={12}>
                            <TextField
                              type="text"
                              fullWidth
                              label="Account ID"
                              value={selectedFriend._id}
                              InputProps={{ readOnly: true }}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <TextField
                              type="number"
                              fullWidth
                              label="Amount"
                              value={amount}
                              onChange={(e) => setAmount(e.target.value)}
                            />
                          </Grid>
                          <Grid item xs={12}>
                            <Button
                              variant="contained"
                              onClick={handleTransferMoney}
                              sx={{ mt: 2 }}
                            >
                              Transfer Money
                            </Button>
                          </Grid>
                        </>
                      )}
                    </Grid>
                  ) : (
                    <>
                      <DialogTitle>No Friends' Accounts Active</DialogTitle>
                      <DialogContent className="hideScrollBar" sx={{ mt: 4 }}>
                        <p>
                          None of your friends have activated their accounts.
                          Please ask them to activate their accounts to enjoy
                          seamless transactions and features.
                        </p>
                      </DialogContent>
                    </>
                  )}
                </>
              )}
            </>
          )}
        </DialogContent>
        {!paymentSuccess && !showPaymentPin && !MainLoader && (
          <DialogActions>
            <Button variant="contained" onClick={handleClose}>
              Close
            </Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
};

export default SendMoney;
