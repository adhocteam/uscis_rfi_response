import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import AdminPage from "./AdminPage";
import UploadPage from "./UploadPage";

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={UploadPage} />
        <Route path="/review" component={AdminPage} />
      </Switch>
    </BrowserRouter>
  );
}
