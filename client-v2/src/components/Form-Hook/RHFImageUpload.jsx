import React, { useState } from "react";
import PropTypes from "prop-types";

// Form Hook
import { Controller, useFormContext } from "react-hook-form";

// MUI
import {
  Button,
  Typography,
  Box,
  Paper,
  IconButton,
  Stack,
} from "@mui/material";
import { X } from "phosphor-react";

const RHFImageUpload = ({ name, label, helperText, ...other }) => {
  const { control, setValue } = useFormContext();
  const [imagePreview, setImagePreview] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setValue(name, file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleClearImage = () => {
    setValue(name, null);
    setImagePreview(null);
  };

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange } }) => (
        <Stack
          width={"100%"}
          direction={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <input
            accept="image/*"
            style={{ display: "none" }}
            id={name}
            type="file"
            onChange={(e) => {
              handleImageChange(e);
              onChange(e.target.files[0]);
            }}
            {...other}
          />
          <label htmlFor={name}>
            <Button component="span" variant="outlined">
              {label}
            </Button>
          </label>
          <Typography marginTop={"2px"} variant="body2" color="textSecondary">
            {helperText}
          </Typography>
          {imagePreview && (
            <Box mt={2} position={"relative"}>
              <Box
                component="img"
                sx={{
                  height: 200,
                  width: 200,
                  objectFit: "cover",
                  borderRadius: "10px",
                  objectPosition: "top ",
                  border: "1px solid #00243d",
                }}
                alt="pic"
                src={imagePreview}
              />
              <IconButton
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                }}
                onClick={handleClearImage}
              >
                <X />
              </IconButton>
            </Box>
          )}
        </Stack>
      )}
    />
  );
};

RHFImageUpload.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  helperText: PropTypes.string,
};

export default RHFImageUpload;
