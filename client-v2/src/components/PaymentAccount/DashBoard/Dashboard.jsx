import * as React from "react";
import { ThemeProvider } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Badge from "@mui/material/Badge";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Link from "@mui/material/Link";

import Chart from "./Chart";
import UserAccountCard from "./UserAccountCard";
import Transactions from "./Transactions";
import { Stack } from "@mui/material";
import { BellSimple } from "phosphor-react";
import { useTheme } from "@emotion/react";
import Title from "./Title";
import SendMoney from "../SendMoney";
import { useState } from "react";
import { useEffect } from "react";
import {
  FetchTransactionHistory,
  GetBalance,
} from "../../../Redux/Slices/PaymentSlice";
import { useDispatch } from "react-redux";

function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="/">
        Talk Live
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const drawerWidth = 0;

export default function PaymentAccountDashboard() {
  const theme = useTheme();
  const dispatch = useDispatch();
  const [openSendMoneyDialog, setOpenSendMoneyDialog] = useState(false);
  const handleSendMoneyClick = () => {
    setOpenSendMoneyDialog(true);
  };

  useEffect(() => {
    dispatch(FetchTransactionHistory());
    dispatch(GetBalance());
  }, []);

  return (
    <>
      <Box sx={{ display: "flex", width: "100%" }}>
        <Stack
          zIndex={"1"}
          position="absolute"
          sx={{
            width: "100%",
            background:
              theme.palette.mode == "light"
                ? "#FAFAFE"
                : theme.palette.background.paper,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Toolbar
            sx={{
              width: "100%",
              pr: "24px", // keep right padding when drawer closed
            }}
          >
            <Stack
              sx={{
                width: "100%",

                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Title> Account Dashboard</Title>
              <IconButton color="inherit">
                <Badge badgeContent={0} color="secondary">
                  <BellSimple />
                </Badge>
              </IconButton>
            </Stack>
          </Toolbar>
        </Stack>

        <Box
          className="hideScrollBar"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === "light"
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: "100vh",
            overflow: "auto",
          }}
        >
          <Toolbar />
          <Container width="100%" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={8}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: 300,
                  }}
                >
                  <Chart />
                </Paper>
              </Grid>
              {/* Recent Deposits */}
              <Grid item xs={12} md={4}>
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    height: "auto",
                  }}
                >
                  <UserAccountCard
                    handleSendMoneyClick={handleSendMoneyClick}
                  />
                </Paper>
              </Grid>
              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper
                  className="hideScrollBar"
                  sx={{
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    overflowX: "scroll",
                  }}
                >
                  <Transactions />
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
      {openSendMoneyDialog && (
        <SendMoney
          open={openSendMoneyDialog}
          handleClose={() => setOpenSendMoneyDialog(false)}
        />
      )}
    </>
  );
}
