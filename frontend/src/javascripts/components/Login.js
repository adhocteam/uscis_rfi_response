import React from "react";
import AuthService from "../services/Auth";
class Login extends React.Component {
  state = {
    redirectToReferrer: false,
    username: "",
    password: ""
  };
  login = e => {
    e.preventDefault();
    sessionStorage.setItem("token", "fhq412p89fqfp48h");
  };
  render() {
    if (AuthService.validToken()) {
      this.props.history.push("/private");
    }

    return (
      <div className="Login">
        <h2> Login </h2>
        <p> Please enter your email and password </p>
        <p>You must log in to view the page</p>
        <form onSubmit={this.login}>
          <label>
            Username
            <input
              type="text"
              value={this.state.username}
              onChange={e => this.setState({ username: e.target.value })}
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
