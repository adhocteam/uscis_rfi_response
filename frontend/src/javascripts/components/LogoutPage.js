import React from "react";
import { Redirect } from "react-router-dom";

class Logout extends React.Component {
  componentDidMount() {
    // on load, immediately log out by clearing sessionStorage
    sessionStorage.clear();
  }
  render() {
    return <Redirect from="/logout" to="/" />;
  }
}

export default Logout;
