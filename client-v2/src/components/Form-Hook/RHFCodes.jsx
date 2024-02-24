import { Stack, TextField } from "@mui/material";
import React, { useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";

export default function RHFCodes({ keyName = "", inputs = [], ...others }) {
  const codesRef = useRef(null);
  const { control } = useFormContext();

  const handleChangeWithNextFieldSwitch = (event, handleChange) => {
    const { maxLength, value, name } = event.target;
    const fieldIndex = name.replace(keyName, "");
    const fieldIndexInt = Number(fieldIndex);
    const nextField = document.querySelector(
      `input[name=${keyName}${fieldIndexInt + 1}]`
    );

    if (value.length > maxLength) {
      event.target.value = value[0];
    }
    if (value.length >= maxLength && fieldIndexInt < 6 && nextField) {
      nextField.focus();
    }

    handleChange(event);
  };

  return (
    <>
      <Stack
        direction={"row"}
        spacing={2}
        justifyContent={"center"}
        alignItems={"center"}
        ref={codesRef}
      >
        {inputs?.map((input, i) => {
          return (
            <Controller
              key={i}
              name={`${keyName}${i + 1}`}
              control={control}
              render={({ field, fieldState: { error } }) => {
                return (
                  <TextField
                    {...field}
                    error={!!error}
                    autoFocus={i === 0}
                    placeholder=".."
                    onChange={(e) => {
                      handleChangeWithNextFieldSwitch(e, field.onChange);
                    }}
                    onFocus={(e) => e.currentTarget.select()}
                    InputProps={{
                      sx: {
                        width: { xs: 36, sm: 56 },
                        height: { xs: 36, sm: 56 },
                        "& input": { p: 0, textAlign: "center" },
                      },
                    }}
                    inputProps={{
                      maxLength: 1,
                      type: "number",
                    }}
                    {...others}
                  ></TextField>
                );
              }}
            ></Controller>
          );
        })}
      </Stack>
    </>
  );
}
