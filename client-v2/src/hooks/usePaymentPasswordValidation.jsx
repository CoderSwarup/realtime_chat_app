import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ShowSnackbar } from "../Redux/Slices/AppSlice";
import AxiosInstance from "../utils/Axios";

export const usePaymentPasswordValidation = () => {
  const dispatch = useDispatch();
  const { token } = useSelector((state) => state.auth);
  const [isPasswordCorrect, setIsPasswordCorrect] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pinAttempts, setPinAttempts] = useState(0);

  const handlePasswordSubmit = async (
    password,
    setPaymentSuccess = () => {},
    setShowPaymentPin = () => {}
  ) => {
    setLoading(true);
    try {
      const { code1, code2, code3, code4, code5, code6 } = password;
      const pass = code1 + code2 + code3 + code4 + code5 + code6;

      const res = await AxiosInstance.post(
        "/account/check-password",
        {
          password: pass,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.data.isTrue) {
        setIsPasswordCorrect(true);
        setPaymentSuccess(true); // Trigger payment success
        setShowPaymentPin(false); // Close payment PIN dialog on success
        dispatch(ShowSnackbar("success", "Pin Correct"));
      }
    } catch (error) {
      // console.log(error);

      setIsPasswordCorrect(false);
      setPinAttempts((prev) => prev + 1);

      if (pinAttempts >= 2) {
        dispatch(
          ShowSnackbar(
            "error",
            "Too many incorrect attempts. Payment process closed."
          )
        );
        setShowPaymentPin(false); // Close payment PIN dialog on too many attempts
        setPinAttempts(0);
      } else {
        dispatch(ShowSnackbar("error", error.response.data.error));
      }
    } finally {
      setLoading(false);
    }
  };

  return {
    isPasswordCorrect,
    handlePasswordSubmit,
    loading,
  };
};
