import React, { useState } from "react";
import { useSelector } from "react-redux";
import {
  Avatar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";
import {
  Wallet,
  LockSimple,
  QrCode,
  DotsThreeVertical as MoreVertIcon,
  Share,
} from "phosphor-react";
import Title from "./Title";
import QrCodeGenerator from "../QrCodeGenerator";
import DepositeMoney from "../DepositeMoney";
function preventDefault(event) {
  event.preventDefault();
}
export default function UserAccountCard({ handleSendMoneyClick }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [openQrCodeGenerator, setOpenQrCodeGenerator] = useState(false);
  const { accountDetails } = useSelector((state) => state.payment);
  const qrData = { accountId: accountDetails?._id, amount: 0 };
  const [openDepositeMoney, setOpenDepositeMoney] = useState(false);

  const handleMenuClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleQrCodeClick = () => {
    setOpenQrCodeGenerator(true);
    handleMenuClose(); // Close the menu after handling QR code generation
  };

  return (
    <>
      <Box width="100%">
        <Stack
          sx={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Title>Account Details</Title>
          <IconButton
            aria-label="more options"
            aria-controls="account-options"
            aria-haspopup="true"
            onClick={handleMenuClick}
          >
            <MoreVertIcon />
          </IconButton>
        </Stack>

        <Box
          my={2}
          width="100%"
          sx={{
            display: "flex",
            flexDirection: {
              xs: "column",
              sm: "row",
            },
            justifyContent: "space-between",
            alignItems: "start",
            gap: "10px",
          }}
        >
          <Avatar
            src={accountDetails?.user.avatar}
            sx={{ width: "100px", height: "100px" }}
            alt="user-avatar"
          />
          <Box>
            <Typography variant="body2" gutterBottom>
              {accountDetails?.user.firstName +
                " " +
                accountDetails?.user.lastName}
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              Email:
              <Typography display="block" variant="caption">
                {accountDetails?.user.email}
              </Typography>
            </Typography>
            <Typography color="text.secondary" gutterBottom>
              Account ID:
              <Typography display="block" variant="caption">
                {accountDetails?._id}
              </Typography>
            </Typography>
          </Box>
        </Box>

        <Typography component="p" variant="body">
          Balance: {accountDetails?.walletBalance.toFixed(2)} ₹
        </Typography>

        <Box display="flex">
          <Tooltip title="Deposit Money">
            <IconButton
              color="primary"
              aria-label="deposit money"
              onClick={() => setOpenDepositeMoney(true)}
            >
              <Wallet />
            </IconButton>
          </Tooltip>

          <Tooltip title="Transfer Money">
            <IconButton
              color="primary"
              aria-label="transfer Money"
              onClick={handleSendMoneyClick}
            >
              <Share />
            </IconButton>
          </Tooltip>
        </Box>

        <Menu
          id="account-options"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          getContentAnchorEl={null}
        >
          <MenuItem onClick={handleQrCodeClick}>
            <QrCode size={24} style={{ marginRight: "8px" }} />
            Generate QR Code
          </MenuItem>
          <MenuItem onClick={handleSendMoneyClick}>
            <Share size={24} style={{ marginRight: "8px" }} />
            Transfer Money
          </MenuItem>
          <MenuItem onClick={() => setOpenDepositeMoney(true)}>
            <Wallet size={24} style={{ marginRight: "8px" }} />
            Deposit Money
          </MenuItem>
          <MenuItem onClick={preventDefault}>
            <LockSimple size={24} style={{ marginRight: "8px" }} />
            Forgot Password
          </MenuItem>
        </Menu>

        <QrCodeGenerator
          open={openQrCodeGenerator}
          handleClose={() => setOpenQrCodeGenerator(false)}
          qrData={qrData}
        />
      </Box>

      {openDepositeMoney && (
        <DepositeMoney
          open={openDepositeMoney}
          handleClose={() => setOpenDepositeMoney(false)}
        />
      )}
    </>
  );
}
