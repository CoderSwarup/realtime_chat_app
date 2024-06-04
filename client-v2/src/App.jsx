import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ThemeProvider from "./theme";
import ThemeSettings from "./components/settings";
import Router from "./routes";
import { Alert, Snackbar } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { HideSnackBar } from "./Redux/Slices/AppSlice";

function App() {
  const dispatch = useDispatch();
  const { open, message, severity } = useSelector(
    (state) => state.app?.snackbar
  );

  return (
    <>
      {open && message ? (
        <Snackbar
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          open={open}
          autoHideDuration={5000}
          key={Math.random()}
          onClose={() => {
            dispatch(HideSnackBar());
          }}
        >
          <Alert
            onClose={() => {
              dispatch(HideSnackBar());
            }}
            severity={severity}
            variant="filled"
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      ) : (
        <></>
      )}
      <ThemeProvider>
        <ThemeSettings>
          <Router></Router>
        </ThemeSettings>
      </ThemeProvider>
    </>
  );
}

export default App;
