import React from "react";
import { Router, Link, Route, Switch } from "react-router-dom";

import history from "../services/history";
import NavLinks from "./NavLinks";
import NamePlate from "./NamePlate";
import AdminPage from "./AdminPage";
import LoginPage from "./LoginPage";
import LogoutPage from "./LogoutPage";
import UploadPage from "./UploadPage";
import RequestUpload from "./RequestUpload";

export default function App() {
  return (
    <Router history={history}>
      <div>
        <header className="ds-u-fill--primary-darkest">
          <div className="ds-l-container">
            <div className="ds-l-row">
              <div className="ds-l-col--12 ds-l-md-col--4">
                <h1
                  id="main"
                  className="ds-u-margin--0 ds-u-margin-top--1 ds-u-margin-bottom--1"
                >
                  <Link
                    to="/"
                    className="ds-u-color--white ds-u-font-size--h3 ds-u-font-weight--bold"
                  >
                    USCIS RFDS Front-End
                  </Link>
                </h1>
              </div>
              <NavLinks />
            </div>
          </div>
          <NamePlate />
        </header>
        <Switch>
          <Route path="/login" exact component={LoginPage} />
          <Route path="/logout" exact component={LogoutPage} />
          <Route path="/review" component={AdminPage} />
          <Route path="/request" component={RequestUpload} />
          <Route path="/" exact component={UploadPage} />
        </Switch>
      </div>
    </Router>
  );
}
