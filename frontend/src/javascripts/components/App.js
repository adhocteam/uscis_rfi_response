import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import UploadPage from "./UploadPage";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";

const Protected = () => <h3>Protected</h3>;

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={UploadPage} />
        <Route path="/login" exact component={Login} />
        <PrivateRoute path="/admin" exact component={Protected} />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
}
