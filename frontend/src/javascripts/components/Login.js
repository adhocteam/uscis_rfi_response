import React from "react";
import AuthService from "../services/Auth";
import UscisApiService from "../services/UscisApiService";

class Login extends React.Component {
  state = {
    redirectToReferrer: false
  };
  login = e => {
    e.preventDefault();
    UscisApiService.login(this.state.email, this.state.password).then(resp => {
      // valid response has status code of 200 and puts user info
      // in data field
      if (resp.data) {
        this.props.history.push("/admin");
      }
    });
  };
  render() {
    if (AuthService.validToken()) {
      this.props.history.push("/admin");
    }

    return (
      <div className="Login">
        <h2> Login </h2>
        <p> Please enter your email and password </p>
        <p>You must log in to view the page</p>
        <form onSubmit={this.login}>
          <label>
            Email
            <input
              type="text"
              value={this.state.email}
              onChange={e => this.setState({ email: e.target.value })}
            />
          </label>
          <br />
          <label>
            Password
            <input
              type="password"
              value={this.state.password}
              onChange={e => this.setState({ password: e.target.value })}
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
