import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { HelmetProvider } from "react-helmet-async";
import { BrowserRouter } from "react-router-dom";
import SettingsProvider from "./contexts/SettingsContext.jsx";
import { Provider as ReduxProvider } from "react-redux";
import { store } from "./Redux/store.jsx";
import { ApolloProvider } from "@apollo/client";
import client from "./GraphQl/GraphQl_Config.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider>
      <ReduxProvider store={store}>
        <ApolloProvider client={client}>
          <SettingsProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </SettingsProvider>
        </ApolloProvider>
      </ReduxProvider>
    </HelmetProvider>
  </React.StrictMode>
);
