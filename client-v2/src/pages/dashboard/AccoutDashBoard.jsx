import { useTheme } from "@emotion/react";
import { Stack } from "@mui/material";
import React, { useEffect } from "react";
import PaymentAccountDashboard from "../../components/PaymentAccount/DashBoard/Dashboard";
import PaymentPassword from "../../components/PaymentAccount/PaymentPassword/PaymentPassword";
import { usePaymentPasswordValidation } from "../../hooks/usePaymentPasswordValidation";
import LoadingScreen from "../../components/LoadingScreen";
import { useDispatch, useSelector } from "react-redux";
import { IsAccoutActivate } from "../../Redux/Slices/PaymentSlice";
import ActivateAccount from "../../components/PaymentAccount/ActivateAccount";

export default function AccoutDashBoard() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const {
    isPasswordCorrect,
    handlePasswordSubmit,
    loading: paymentPinLoader,
  } = usePaymentPasswordValidation();
  const { paymentLoader, isAccountPresent } = useSelector(
    (state) => state.payment
  );

  useEffect(() => {
    if (!isAccountPresent) {
      dispatch(IsAccoutActivate());
    }
  }, []);

  if (paymentPinLoader || paymentLoader) {
    return <LoadingScreen />;
  }
  if (!isAccountPresent) {
    return <ActivateAccount />;
  }

  return (
    <Stack
      direction="row"
      sx={{
        width: "100%",
        height: "100vh",
        position: "relative",
        background:
          theme.palette.mode === "light"
            ? "#F0F4FE"
            : theme.palette.background.default,
      }}
    >
      {!isPasswordCorrect ? (
        <PaymentPassword
          onSubmit={handlePasswordSubmit}
          loading={paymentPinLoader}
        />
      ) : (
        <PaymentAccountDashboard />
      )}
    </Stack>
  );
}
