import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import UploadPage from "./UploadPage";
import RequestUpload from "./RequestUpload";

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={UploadPage} />
        <Route path="/request" exact component={RequestUpload} />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
}
