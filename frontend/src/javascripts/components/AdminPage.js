import React from "react";
import { Link, Route, Switch } from "react-router-dom";

import UscisApiService from "../services/UscisApiService";
import Submission from "./Submission";
import Submissions from "./Submissions";

class AdminPage extends React.Component {
  state = { admin: null };

  componentDidMount() {
    this.getAdmin();
  }

  getAdmin = () => {
    UscisApiService.getAdmin()
      .then(admin => {
        this.setState({ admin });
      })
      .catch(err => {
        console.error(err);
      });
  };

  render() {
    const { admin } = this.state;
    const { url } = this.props.match;

    return admin ? (
      <Switch>
        <Route path={`${url}/:id`} component={Submission} />
        <Route path={`${url}`} component={Submissions} />
      </Switch>
    ) : (
      <div className="ds-l-container">
        <p>No admin found!</p>
      </div>
    );
  }
}

export default AdminPage;
