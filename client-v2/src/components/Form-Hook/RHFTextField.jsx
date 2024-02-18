import React from "react";
import Proptypes from "prop-types";

//Form Hook
import { Controller, useFormContext } from "react-hook-form";

//mui
import { TextField } from "@mui/material";

RHFTextField.propTypes = {
  name: Proptypes.string,
  lable: Proptypes.string,
  helperText: Proptypes.node,
};
export default function RHFTextField({ name, helperText, lable, ...other }) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <TextField
            {...field}
            fullWidth
            error={!!error}
            helperText={error ? error.message : helperText}
            {...other}
          />
        );
      }}
    ></Controller>
  );
}
