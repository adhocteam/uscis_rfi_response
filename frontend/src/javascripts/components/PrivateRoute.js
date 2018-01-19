import { Route, Redirect } from "react-router-dom";
import React from "react";
import AuthService from "../services/Auth";

// A PrivateRoute is a route which conditionally renders if
// a valid token is present; redirecting a user to login otherwise
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      AuthService.validToken() ? (
        <Component {...props} />
      ) : (
        <Redirect
          to={{
            pathname: "/login",
            state: { from: props.location }
          }}
        />
      )
    }
  />
);

export default PrivateRoute;
