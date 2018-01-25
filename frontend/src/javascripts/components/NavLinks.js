import React from "react";
import { Link } from "react-router-dom";

import history from "../services/history";
import { isLoggedIn } from "../helpers/session";

const allLinks = [
  {
    url: "/login",
    text: "Log In",
    show_when_logged_out: true,
  },
  {
    url: "/logout",
    text: "Log Out",
    show_when_logged_in: true,
  },
  {
    url: "/",
    text: "Upload Image",
    show_when_logged_in: true,
    show_when_logged_out: true,
  },
  {
    url: "/request",
    text: "Request an Upload",
    show_when_logged_in: true,
  },
  {
    url: "/review",
    text: "Review Submissions",
    show_when_logged_in: true,
  },
];

class NavLinks extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: isLoggedIn(),
    };
    // on route change, update state
    history.listen(() => {
      this.setState({ loggedIn: isLoggedIn() });
    });
  }

  render() {
    const { loggedIn } = this.state;
    return (
      <div className="ds-l-col--12 ds-l-md-col--8 navigation">
        <ul className="ds-u-margin--0 ds-u-margin-top--1 ds-u-margin-bottom--1 ds-u-md-margin-top--3 ds-u-md-margin-bottom--0 ds-u-padding--0 ds-u-md-text-align--right">
          {allLinks
            .filter(link => {
              return loggedIn
                ? link.show_when_logged_in
                : link.show_when_logged_out;
            })
            .map((link, i) => {
              return (
                <li
                  key={i}
                  className="ds-u-display--inline-block  ds-u-margin-right--2"
                >
                  <Link
                    to={link.url}
                    className="ds-u-color--white ds-u-font-weight--bold"
                  >
                    {link.text}
                  </Link>
                </li>
              );
            })}
        </ul>
      </div>
    );
  }
}

export default NavLinks;
