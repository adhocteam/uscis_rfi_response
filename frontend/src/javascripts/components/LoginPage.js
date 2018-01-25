import React from "react";

import history from "../services/history";
import UscisApiService from "../services/UscisApiService";
import Button from "@cmsgov/design-system-core/dist/components/Button/Button";

class Login extends React.Component {
  state = { email: "", password: "", error: null, errorMessage: "" };

  login = e => {
    e.preventDefault();
    UscisApiService.login(this.state.email, this.state.password)
      .then(this.redirect)
      .catch(err => {
        this.setState({ error: true, errorMessage: err.message });
      });
  };

  redirect = () => {
    const queryParams = new URLSearchParams(this.props.location.search);
    history.replace(queryParams.get("next") || "review");
  };

  handleEmailChange = e => this.setState({ email: e.target.value });
  handlePasswordChange = e => this.setState({ password: e.target.value });

  render() {
    return (
      <div className="login ds-l-container ds-u-padding-top--3 ds-u-sm-text-align--center ds-u-sm-text-align--left qa-uscis-upload-page">
        <h2>Login</h2>
        <p>Please enter your email and password.</p>
        <form onSubmit={this.login}>
          <label>
            Email
            <input
              className="ds-c-field"
              type="text"
              value={this.state.email}
              onChange={this.handleEmailChange}
            />
          </label>
          <br />
          <label>
            Password
            <input
              className="ds-c-field"
              type="password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
            />
          </label>
          <br />
          <Button type="submit" variation="primary">
            Submit
          </Button>
        </form>
        <br />
        {this.state.error && (
          <div className="ds-c-alert ds-c-alert--error ds-l-col--12 ds-l-md-col--6">
            <div className="ds-c-alert__body">
              <h3 className="ds-c-alert__heading">{this.state.errorMessage}</h3>
            </div>
          </div>
        )}
      </div>
    );
  }
}
export default Login;
