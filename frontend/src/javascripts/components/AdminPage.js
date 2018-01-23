import React from "react";
import { Route } from "react-router-dom";

import Login from "./Login";
import SubmissionPage from "./SubmissionPage";

class AdminPage extends React.Component {
  render() {
    return (
      <div>
        <Login>
          <Route
            path={`${this.props.match.url}/:id`}
            component={SubmissionPage}
          />
        </Login>
      </div>
    );
  }
}

export default AdminPage;
