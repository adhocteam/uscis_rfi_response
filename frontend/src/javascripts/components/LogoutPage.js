import React from "react";
import { Redirect } from "react-router-dom";

class Logout extends React.Component {
  componentWillMount() {
    // immediately log out by clearing sessionStorage
    sessionStorage.clear();
  }
  render() {
    return <Redirect from="/logout" to="/" />;
  }
}

export default Logout;
