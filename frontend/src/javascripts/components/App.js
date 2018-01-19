import React from "react";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";
import UploadPage from "./UploadPage";
import Login from "./Login";
import PrivateRoute from "./PrivateRoute";

// fake admin page to illustrate routing
const Admin = () => <h3>Welcome to the admin page!</h3>;

export default function App() {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={UploadPage} />
        <Route path="/login" exact component={Login} />
        <PrivateRoute path="/admin" exact component={Admin} />
        <Redirect to="/" />
      </Switch>
    </BrowserRouter>
  );
}
