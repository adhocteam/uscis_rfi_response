import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import UploadPage from "./UploadPage";

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={UploadPage} />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
}
