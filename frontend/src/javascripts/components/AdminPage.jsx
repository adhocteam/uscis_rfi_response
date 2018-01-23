import React from "react";
import { Route } from "react-router-dom";

import UscisApiService from "../services/UscisApiService";
import SubmissionPage from "./SubmissionPage";

class AdminPage extends React.Component {
  state = { admin: null };

  componentDidMount() {
    this.getAdmin();
  }

  getAdmin = () => {
    UscisApiService
      .getAdmin()
      .then(admin => { this.setState({ admin }) })
      .catch(err => { console.error(err); });
  };

  render() {
    const { admin } = this.state;
    return admin ? (
      <div>
        <p>Hello, {admin.name || admin.email}!</p>
        <Route
          path={`${this.props.match.url}/:id`}
          component={SubmissionPage}
        />
      </div>
    ) : <p>No admin found!</p>;
  }
}

export default AdminPage;
