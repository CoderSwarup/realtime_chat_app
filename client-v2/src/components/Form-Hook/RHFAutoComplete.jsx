import React from "react";
import Proptypes from "prop-types";

//Form Hook
import { Controller, useFormContext } from "react-hook-form";

//mui
import Autocomplete from "@mui/material/Autocomplete";
import { TextField } from "@mui/material";

RHFAutoComplete.propTypes = {
  name: Proptypes.string,
  lable: Proptypes.string,
  helperText: Proptypes.node,
};
export default function RHFAutoComplete({ name, helperText, lable, ...other }) {
  const { control, setValue } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState: { error } }) => {
        return (
          <Autocomplete
            {...field}
            fullWidth
            onChange={(e, newValue) => {
              setValue(name, newValue, { shouldValidate: true });
            }}
            {...other}
            renderInput={(params) => {
              return (
                <TextField
                  {...params}
                  lable={lable}
                  placeholder="Members"
                  error={!!error}
                  helperText={error ? error.message : helperText}
                />
              );
            }}
          />
        );
      }}
    ></Controller>
  );
}
