import { createMuiTheme, CssBaseline, ThemeProvider } from "@material-ui/core";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
const theme = createMuiTheme({
  overrides: {
    MuiAppBar: {
      colorPrimary: {
        backgroundColor: "#20222a",
        color: "white",
      },
    },
    MuiIconButton: {
      root: {
        color: "inherit",
        padding: "10px",
      },
    },
  },
});
ReactDOM.render(
  <ThemeProvider theme={theme}>
    <App />
    <CssBaseline />
  </ThemeProvider>,
  document.getElementById("root")
);
