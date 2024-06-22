import * as React from "react";
import { useState, useEffect } from "react";
import { useTheme } from "@mui/material/styles";
import { LineChart, axisClasses } from "@mui/x-charts";

import Title from "./Title";
import { useSelector } from "react-redux";
import { CircularProgress, Stack, Typography } from "@mui/material";

export default function Chart() {
  const theme = useTheme();
  const { chartData, historyloading } = useSelector(
    (state) => state.payment.transcationHistory
  );

  // Check if chartData is empty or not loaded yet
  if (historyloading) {
    return (
      <React.Fragment>
        <Title>Transaction History Chart</Title>
        <Stack
          alignItems={"center"}
          width={"100%"}
          height={"100%"}
          justifyContent={"center"}
        >
          <CircularProgress />
        </Stack>
      </React.Fragment>
    );
  }

  // Format data for LineChart directly from chartData
  const data = chartData.map(({ date, amount }) => ({
    time: new Date(date).toLocaleDateString("en-US"),
    amount,
  }));

  // Handling when there's only one date available
  if (data.length === 1) {
    // Duplicate the single date with a zero amount to visualize it on the chart
    data.push({
      time: new Date(chartData[0].date).toLocaleDateString("en-US"),
      amount: 0,
    });
  }

  if (!chartData || chartData.length == 0) {
    <React.Fragment>
      <Title>Transaction History Chart</Title>
      <Stack
        alignItems={"center"}
        width={"100%"}
        height={"100%"}
        justifyContent={"center"}
      >
        <Typography variant="h3"> NO HISTORY FOUND</Typography>
      </Stack>
    </React.Fragment>;
  }

  return (
    <React.Fragment>
      <Title>Transaction History Chart</Title>
      <div style={{ width: "100%", flexGrow: 1, overflow: "hidden" }}>
        <LineChart
          dataset={data}
          margin={{
            top: 16,
            right: 20,
            left: 70,
            bottom: 30,
          }}
          xAxis={[
            {
              scaleType: "point",
              dataKey: "time",
              tickNumber: data.length > 7 ? 7 : data.length, // Limit ticks to avoid overcrowding
              tickLabelStyle: theme.typography.body2,
            },
          ]}
          yAxis={[
            {
              label: "Total Amount ($)",
              labelStyle: {
                ...theme.typography.body1,
                fill: theme.palette.text.primary,
              },
              tickLabelStyle: theme.typography.body2,
              tickNumber: 5,
              domain: [0, "auto"], // Automatically adjust domain based on data
            },
          ]}
          series={[
            {
              dataKey: "amount",
              showMark: false,
              color: theme.palette.primary.light,
            },
          ]}
          sx={{
            [`.${axisClasses.root} line`]: {
              stroke: theme.palette.text.secondary,
            },
            [`.${axisClasses.root} text`]: {
              fill: theme.palette.text.secondary,
            },
            [`& .${axisClasses.left} .${axisClasses.label}`]: {
              transform: "translateX(-25px)",
            },
          }}
        />
      </div>
    </React.Fragment>
  );
}
