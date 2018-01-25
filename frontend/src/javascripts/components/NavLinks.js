import React from "react";
import { Link } from "react-router-dom";

import UscisApiService from "../services/UscisApiService";
import history from "../services/history";

class NavLinks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      admin: !!sessionStorage.getItem("token"),
    };
    history.listen((location, action) => {
      this.setState({ admin: !!sessionStorage.getItem("token") });
    });
  }

  render() {
    return (
      <div className="ds-l-col--12 ds-l-md-col--6">
        {!this.state.admin && (
          <ul className="ds-u-margin--0 ds-u-margin-top--3 ds-u-padding--0">
            <Link to="/login" className="ds-u-color--white">
              Log In
            </Link>
          </ul>
        )}
        {this.state.admin && (
          <ul className="ds-u-margin--0 ds-u-margin-top--3 ds-u-padding--0">
            <Link
              to="/logout"
              className="ds-u-color--white ds-u-padding-right--1"
            >
              Log Out
            </Link>
            <Link
              to="/request"
              className="ds-u-color--white ds-u-padding-right--1"
            >
              Request an Upload
            </Link>
            <Link to="/review" className="ds-u-color--white">
              Review Submissions
            </Link>
          </ul>
        )}
      </div>
    );
  }
}

export default NavLinks;
