import React from "react";
import { Router, Route, Switch } from "react-router-dom";

import history from "../history";
import AdminPage from "./AdminPage";
import LoginPage from "./LoginPage";
import UploadPage from "./UploadPage";

export default function App() {
  return (
    <Router history={history}>
      <Switch>
        <Route path="/login" exact component={LoginPage} />
        <Route path="/review" component={AdminPage} />
        <Route path="/" exact component={UploadPage} />
      </Switch>
    </Router>
  );
}
