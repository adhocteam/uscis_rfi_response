import React from "react";

import UscisApiService from "../services/UscisApiService";

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { admin: null };
  }

  componentDidMount() {
    this.getAdmin();
  }

  getAdmin = () => {
    UscisApiService
      .getAdmin()
      .then(data => {
        const admin = {
          uid: data.uid,
          name: data.name,
          email: data.email
        };
        this.setState({ admin });
      });
  };

  login = e => {
    e.preventDefault();
    UscisApiService
      .login(this.state.email, this.state.password)
      .then(this.getAdmin());
  };

  handleEmailChange = e => this.setState({ email: e.target.value });
  handlePasswordChange = e => this.setState({ password: e.target.value });

  renderLogin = () => (
    <div className="Login">
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

  render() {
    return this.state.admin ? this.props.children : this.renderLogin();
  }
}
export default Login;
