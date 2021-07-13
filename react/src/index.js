import React from "react";
import ReactDOM from "react-dom";
import { HashRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import "./tailwind.css";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { theme } from "./material-ui/theme";
import reportWebVitals from "./reportWebVitals";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import ErrorBoundary from "./components/ErrorBoundary";
import { CssBaseline } from "@material-ui/core";

ReactDOM.render(
  <HashRouter>
    <ErrorBoundary>
      <MuiThemeProvider theme={theme}>
        <CssBaseline>
          {/* <React.StrictMode> */}
          <App />
          {/* </React.StrictMode> */}
        </CssBaseline>
      </MuiThemeProvider>
    </ErrorBoundary>
  </HashRouter>,
  document.getElementById("root")
);

reportWebVitals();
// Service Workerを登録
serviceWorkerRegistration.register();
// .then((reg) => console.log("SW registered!", reg))
// .catch((err) => console.log("Boo!", err));
