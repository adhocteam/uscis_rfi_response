import React from "react";

import history from "../history";
import UscisApiService from "../services/UscisApiService";

class Login extends React.Component {
  state = { email: "", password: "" };

  login = e => {
    e.preventDefault();
    UscisApiService.login(this.state.email, this.state.password)
      .then(this.redirect)
      .catch(err => {
        console.error(err);
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
      <div className="login">
        <h2>Login</h2>
        <p>Please enter your email and password</p>
        <p>You must log in to view the page</p>
        <form onSubmit={this.login}>
          <label>
            Email
            <input
              type="text"
              value={this.state.email}
              onChange={this.handleEmailChange}
            />
          </label>
          <br />
          <label>
            Password
            <input
              type="password"
              value={this.state.password}
              onChange={this.handlePasswordChange}
            />
          </label>
          <br />
          <input type="submit" value="Log In" />
        </form>
      </div>
    );
  }
}
export default Login;
