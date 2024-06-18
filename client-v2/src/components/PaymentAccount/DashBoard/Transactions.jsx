import * as React from "react";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Link from "@mui/material/Link";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Title from "./Title";
import Pagination from "@mui/material/Pagination";
import { CircularProgress, Stack } from "@mui/material";

// Function to simulate fetching data (replace with actual Redux action)
function fetchTransactions() {
  // Simulating async fetch
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        createData(
          0,
          "2023-06-01",
          "John Doe",
          "Alice Smith",
          500.0,
          "Success"
        ),
        createData(
          1,
          "2023-06-02",
          "Jane Smith",
          "Bob Johnson",
          300.0,
          "Pending"
        ),
        createData(
          2,
          "2023-06-03",
          "David Johnson",
          "Mary Brown",
          800.0,
          "Success"
        ),
        createData(
          3,
          "2023-06-04",
          "Emily Davis",
          "James Miller",
          1200.0,
          "Failed"
        ),
        createData(
          4,
          "2023-06-05",
          "Michael Wilson",
          "Emma Garcia",
          600.0,
          "Success"
        ),
        createData(
          5,
          "2023-06-06",
          "Sarah Brown",
          "Olivia Rodriguez",
          1000.0,
          "Pending"
        ),
        createData(
          6,
          "2023-06-07",
          "James Miller",
          "Daniel Martinez",
          400.0,
          "Success"
        ),
        createData(
          7,
          "2023-06-08",
          "Emma Garcia",
          "John Doe",
          700.0,
          "Success"
        ),
        createData(
          8,
          "2023-06-09",
          "Daniel Martinez",
          "Sarah Brown",
          900.0,
          "Pending"
        ),
        createData(
          9,
          "2023-06-10",
          "Olivia Rodriguez",
          "David Johnson",
          1100.0,
          "Success"
        ),
      ]);
    }, 1000); // Simulated delay of 1 second
  });
}

// Generate Transaction Data
function createData(id, date, sender, receiver, amount, status) {
  return { id, date, sender, receiver, amount, status };
}

export default function Transactions() {
  const [page, setPage] = useState(1);
  const rowsPerPage = 5;

  const { transactions, historyloading } = useSelector(
    (state) => state.payment.transcationHistory
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const emptyRows =
    rowsPerPage -
    Math.min(rowsPerPage, transactions.length - (page - 1) * rowsPerPage);

  if (historyloading || transactions.length === 0 || !transactions) {
    return (
      <React.Fragment>
        <Title>Transaction History </Title>
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
  return (
    <React.Fragment>
      <Title>Transaction History</Title>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Date</TableCell>
            <TableCell>Sender</TableCell>
            <TableCell>Receiver</TableCell>
            <TableCell align="right">Amount</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {(rowsPerPage > 0
            ? transactions.slice(
                (page - 1) * rowsPerPage,
                (page - 1) * rowsPerPage + rowsPerPage
              )
            : transactions
          ).map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>{transaction.date}</TableCell>
              <TableCell>{transaction.sender}</TableCell>
              <TableCell>{transaction.receiver}</TableCell>
              <TableCell align="right">
                <span
                  style={{
                    color:
                      transaction.status === "Success" && transaction.amount > 0
                        ? "green"
                        : "red",
                  }}
                >
                  {transaction.amount.toFixed(2)}
                </span>
              </TableCell>
              <TableCell>{transaction.status}</TableCell>
            </TableRow>
          ))}
          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={5} />
            </TableRow>
          )}
        </TableBody>
      </Table>
      <Pagination
        sx={{ mt: 2, display: "flex", justifyContent: "center" }}
        count={Math.ceil(transactions.length / rowsPerPage)}
        page={page}
        onChange={handleChangePage}
        color="primary"
      />
    </React.Fragment>
  );
}
