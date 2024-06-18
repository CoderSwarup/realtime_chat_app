import React, { useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./CheckoutForm";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import AxiosInstance from "../../utils/Axios";
import { useDispatch, useSelector } from "react-redux";
import { ShowSnackbar } from "../../Redux/Slices/AppSlice";
import { SetBalance } from "../../Redux/Slices/PaymentSlice";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

export default function DepositeMoney({ open, handleClose }) {
  const dispatch = useDispatch();
  const [amount, setAmount] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const { token } = useSelector((state) => state.auth);
  const [paymentIntentId, setPaymentIntentId] = useState("");

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  };

  const createPaymentIntent = async () => {
    if (amount === null || !amount || amount <= 0) {
      dispatch(ShowSnackbar("warning", "Enter Valid Amount"));
      return;
    }
    try {
      const response = await AxiosInstance.post(
        "/account/create-payment-intent",
        {
          amount,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.data;
      setClientSecret(data.clientSecret);
      setPaymentIntentId(data.paymentIntentId);
    } catch (error) {
      dispatch(ShowSnackbar("error", "Something Wrong Please Try Later"));
    }
  };

  const handleSuccess = async () => {
    try {
      const response = await AxiosInstance.post(
        "/account/confirm-payment",
        {
          paymentIntentId: paymentIntentId,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseData = response.data;
      dispatch(SetBalance(responseData.balance));
      dispatch(ShowSnackbar("success", responseData.message));
    } catch (error) {
      dispatch(ShowSnackbar("error", "Something Wrong Please Try Later"));
    }
    handleClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      aria-labelledby="send-money-dialog"
      keepMounted
    >
      <DialogTitle>Deposit Money</DialogTitle>
      <DialogContent className="hideScrollBar">
        <div className="App">
          <Stack
            width="100%"
            sx={{
              direction: {
                xs: "column",
                md: "row",
              },
              alignItems: "center",
              justifyContent: "center",
              my: 3,
              gap: 2, // Add some space between the TextField and Button
            }}
          >
            <TextField
              fullWidth
              type="number"
              value={amount}
              onChange={handleAmountChange}
              placeholder="Enter amount"
              sx={{
                fontSize: "8px",
              }}
              inputProps={{ style: { fontSize: "16px", padding: "10px" } }} // Adjust font size and padding
            />
            <Button
              fullWidth
              size="large"
              variant="outlined"
              onClick={createPaymentIntent}
            >
              Deposit
            </Button>
          </Stack>
          {clientSecret && (
            <Elements
              stripe={stripePromise}
              options={{ clientSecret: clientSecret }}
            >
              <CheckoutForm
                amount={amount}
                clientSecret={clientSecret}
                onSuccess={handleSuccess}
              />
            </Elements>
          )}
        </div>
      </DialogContent>
      <DialogActions></DialogActions>
    </Dialog>
  );
}
