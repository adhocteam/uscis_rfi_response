import React from "react";
import { Router, Route, Switch } from "react-router-dom";

import history from "../history";
import AdminPage from "./AdminPage";
import LoginPage from "./LoginPage";
import UploadPage from "./UploadPage";

export default function App() {
  return (
    <Router history={history}>
      <div>
        <div className="ds-u-fill--primary-darkest">
          <div className="ds-l-container ds-u-md-padding-top--1">
            <div className="ds-l-row">
              <div className="ds-l-col">
                <h1
                  id="main"
                  className="ds-u-serif ds-u-color--white ds-u-font-size--h2 ds-u-md-font-size--h1 ds-u-font-weight--normal ds-u-margin-top--3 ds-u-margin-bottom--3"
                >
                  USCIS Uploader Front-End
                </h1>
              </div>
            </div>
          </div>
        </div>
        <Switch>
          <Route path="/login" exact component={LoginPage} />
          <Route path="/review" component={AdminPage} />
          <Route path="/" exact component={UploadPage} />
        </Switch>
      </div>
    </Router>
  );
}
