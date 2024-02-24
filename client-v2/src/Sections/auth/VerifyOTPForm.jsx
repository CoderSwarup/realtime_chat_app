import { yupResolver } from "@hookform/resolvers/yup/dist/yup";
import React from "react";
import { useForm } from "react-hook-form";
import * as Yup from "yup";
import FormProvider from "../../components/Form-Hook/FormProvider";
import { Button, Stack } from "@mui/material";
import RHFCodes from "../../components/Form-Hook/RHFCodes";
import { useDispatch, useSelector } from "react-redux";
import { VerifyEmailOTP } from "../../Redux/Slices/AuthSlice";

export default function VerifyOTPForm() {
  const dispatch = useDispatch();
  const { email } = useSelector((state) => state.auth);
  const VerifyOTPFormSchema = Yup.object().shape({
    code1: Yup.string().required("Code is Required"),
    code2: Yup.string().required("Code is Required"),
    code3: Yup.string().required("Code is Required"),
    code4: Yup.string().required("Code is Required"),
    code5: Yup.string().required("Code is Required"),
    code6: Yup.string().required("Code is Required"),
  });

  const defaultValues = {
    code1: "",
    code2: "",
    code3: "",
    code4: "",
    code5: "",
    code6: "",
  };

  const methods = useForm({
    mode: "onChange",
    resolver: yupResolver(VerifyOTPFormSchema),
    defaultValues,
  });

  const { handleSubmit, formState } = methods;

  const onSubmit = async (data) => {
    try {
      //api
      dispatch(
        VerifyEmailOTP({
          email,
          otp: `${data.code1}${data.code2}${data.code3}${data.code4}${data.code5}${data.code6}`,
        })
      );
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <FormProvider methods={methods} onSubmit={handleSubmit(onSubmit)}>
      <Stack spacing={2}>
        {/* Inputs  */}
        <RHFCodes
          keyName="code"
          inputs={["code1", "code2", "code3", "code4", "code5", "code6"]}
        />
        <Button
          fullWidth
          size="large"
          color="inherit"
          type="submit"
          variant="contained"
          sx={{
            bgcolor: "text.primary",
            color: (theme) =>
              theme.palette.mode == "light" ? "common.white" : "gray.800",
            "&:hover": {
              bgcolor: "text.primary",
              color: (theme) =>
                theme.palette.mode == "light" ? "common.white" : "gray.800",
            },
          }}
        >
          Verify
        </Button>
      </Stack>
    </FormProvider>
  );
}
