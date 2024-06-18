import { createSlice } from "@reduxjs/toolkit";
import AxiosInstance from "../../utils/Axios";
import { ShowSnackbar } from "./AppSlice";

const initialState = {
  paymentLoader: true,
  isAccountPresent: false,
  transactionHistory: [],
  accountDetails: null,
  transcationHistory: {
    transactions: [],
    chartData: [],
    historyloading: false,
  },
  friendsAccount: [],
};

const PaymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    togglePaymentLoader: (state, action) => {
      state.paymentLoader = action.payload.isLoading;
    },
    setAccountPresent: (state, action) => {
      state.isAccountPresent = action.payload.isAccountPresent;
    },
    setAccountDetails: (state, action) => {
      state.accountDetails = action.payload.accountDetails;
    },
    setFriendsAccout: (state, action) => {
      state.friendsAccount = action.payload.friendsAccount;
    },

    setTransactionHistory: (state, action) => {
      state.transcationHistory.transactions = action.payload.transactions;
      state.transcationHistory.chartData = action.payload.chartData;
    },
    toggleTransactionHistoryLoader: (state, action) => {
      state.transcationHistory.historyloading = action.payload.isLoading;
    },
    setBalance(state, action) {
      state.accountDetails.walletBalance = action.payload.balance;
    },
  },
});

export function IsAccoutActivate() {
  return async (dispatch, getState) => {
    dispatch(PaymentSlice.actions.togglePaymentLoader({ isLoading: true }));

    const token = getState().auth?.token;
    if (!token) {
      console.error("Token is missing");
      dispatch(
        PaymentSlice.actions.setAccountPresent({ isAccountPresent: false })
      );
      dispatch(PaymentSlice.actions.togglePaymentLoader({ isLoading: false }));
      return;
    }

    try {
      const res = await AxiosInstance.post(
        "/account/get-account-details",
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res?.data?.status) {
        dispatch(
          PaymentSlice.actions.setAccountPresent({ isAccountPresent: true })
        );
        dispatch(
          PaymentSlice.actions.setAccountDetails({
            accountDetails: res?.data?.accountDetails,
          })
        );
      } else {
        dispatch(
          PaymentSlice.actions.setAccountPresent({ isAccountPresent: false })
        );
      }
    } catch (err) {
      console.error("Error in API call:", err);
      dispatch(
        PaymentSlice.actions.setAccountPresent({ isAccountPresent: false })
      );
    }

    dispatch(PaymentSlice.actions.togglePaymentLoader({ isLoading: false }));
  };
}

export function CreateAccount(password) {
  return async function (dispatch, getState) {
    dispatch(PaymentSlice.actions.togglePaymentLoader({ isLoading: true }));
    await AxiosInstance.post(
      "account/create-account",
      {
        accountPassword: password,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth?.token}`,
        },
      }
    )
      .then((res) => {
        if (res?.data?.status) {
          console.log(res?.data?.accountDetails);
          dispatch(
            PaymentSlice.actions.setAccountPresent({ isAccountPresent: true })
          );
          dispatch(
            PaymentSlice.actions.setAccountDetails({
              accountDetails: res?.data?.accountDetails,
            })
          );
          dispatch(ShowSnackbar("success", "Account Created SuccessFully"));
        } else {
          dispatch(ShowSnackbar("info", res?.data?.message));
        }
      })
      .catch((err) => {
        dispatch(
          ShowSnackbar(
            "error",
            err.response?.data?.message ||
              "Some Error Occur For Account Creation"
          )
        );
      });
    dispatch(PaymentSlice.actions.togglePaymentLoader({ isLoading: false }));
  };
}

export function GetFriendsAccount() {
  return async function (dispatch, getState) {
    dispatch(PaymentSlice.actions.togglePaymentLoader({ isLoading: true }));

    try {
      const friends = getState().app.friends;
      const FriendsIds = friends?.map((ele) => ele._id);
      const token = getState().auth?.token;
      if (!token) {
        throw new Error("Authorization token is missing");
      }

      const { data } = await AxiosInstance.post(
        "/account/others-account-details",
        { userIds: FriendsIds },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      dispatch(
        PaymentSlice.actions.setFriendsAccout({
          friendsAccount: data?.accounts ? data?.accounts : [],
        })
      );
    } catch (error) {
      console.log(error);
    } finally {
      dispatch(PaymentSlice.actions.togglePaymentLoader({ isLoading: false }));
    }
  };
}

export function GetBalance() {
  return async (dispatch, getState) => {
    try {
      const data = await AxiosInstance.get("/account/balance", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth?.token}`,
        },
      });
      dispatch(
        PaymentSlice.actions.setBalance({
          balance: data.data.balance,
        })
      );
    } catch (err) {}
  };
}

export function FetchTransactionHistory() {
  return async (dispatch, getState) => {
    dispatch(
      PaymentSlice.actions.toggleTransactionHistoryLoader({ isLoading: true })
    );
    try {
      const data = await AxiosInstance.get("/account/transaction-history", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getState().auth?.token}`,
        },
      });

      dispatch(
        PaymentSlice.actions.setTransactionHistory({
          chartData: data.data.chartData,
          transactions: data.data.transactions,
        })
      );
    } catch (error) {
      console.log("ERR", error);
    } finally {
      dispatch(
        PaymentSlice.actions.toggleTransactionHistoryLoader({
          isLoading: false,
        })
      );
    }
  };
}

export function GetStripePublishableKey() {
  return async (dispatch, getState) => {
    try {
      const data = await AxiosInstance.get(
        "/account/get-stripe-publishablekey",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth?.token}`,
          },
        }
      );
      return data.data.publishableKey;
    } catch (error) {
      return null;
    }
  };
}

export function SetBalance(balance) {
  return async (dispatch, getState) => {
    dispatch(PaymentSlice.actions.setBalance({ balance }));
  };
}

export default PaymentSlice.reducer;
