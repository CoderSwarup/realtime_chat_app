import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";
import ThemeProvider from "./theme";
import ThemeSettings from "./components/settings";
import Router from "./routes";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <ThemeProvider>
        <ThemeSettings>
          <Router></Router>
        </ThemeSettings>
      </ThemeProvider>
    </>
  );
}

export default App;
