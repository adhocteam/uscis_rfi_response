import React from "react";
import history from "../services/history";
import { isLoggedIn, getEmail } from "../helpers/session";

class NamePlate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: isLoggedIn(),
      email: getEmail(),
    };
    // on route change, update state
    history.listen(() => {
      this.setState({
        loggedIn: isLoggedIn(),
        email: getEmail(),
      });
    });
  }

  render() {
    const { loggedIn, email } = this.state;
    if (loggedIn) {
      return (
        <div className="ds-u-fill--primary-darker">
          <div className="ds-l-container">
            <div className="ds-l-row">
              <div className="ds-l-col--12">
                <p className="ds-u-margin-top--1 ds-u-margin-bottom--1 ds-u-color--white qa-uscis-name-plate">
                  Hello! You are logged in as{" "}
                  <span className="ds-u-font-weight--semibold">{email}</span>.
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}

export default NamePlate;
