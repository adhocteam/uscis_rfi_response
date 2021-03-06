import React from "react";
import {Link} from "react-router-dom";
import UscisApiService from "../services/UscisApiService";
import TextField from "@cmsgov/design-system-core/dist/components/TextField/TextField";
import Button from "@cmsgov/design-system-core/dist/components/Button/Button";

class RequestUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      admin: null,
      name: "",
      dob: "",
      email: "",
      street1: "",
      street2: "",
      city: "",
      state: "",
      zip: "",
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }
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

  handleChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value,
    });
  }

  // sends user information, displays, text, and clears form
  handleSubmit(event) {
    event.preventDefault();
    UscisApiService.createUser(
      this.state.name,
      this.state.dob,
      this.state.email,
      this.state.street1,
      this.state.street2,
      this.state.city,
      this.state.state,
      this.state.zip
    ).then(resp => {
      let email = this.state.email;
      this.setState({
        userID: resp.id,
        emailText: email,
        name: "",
        dob: "",
        street1: "",
        street2: "",
        city: "",
        state: "",
        zip: "",
        email: "",
      });
    });
  }

  render() {
    const { admin } = this.state;
    const { url } = this.props.match;

    return admin ? (
      <div className="ds-l-container">
        <h2>Request an Upload</h2>
        <p> Please enter a user's information to generate an upload code.</p>
        <form onSubmit={this.handleSubmit} className="qa-uscis-upload-form">
          <TextField
            label="Name"
            name="name"
            type="text"
            value={this.state.name}
            onChange={this.handleChange}
          />
          <TextField
            label="Date of Birth"
            name="dob"
            type="text"
            value={this.state.dob}
            onChange={this.handleChange}
          />
          <TextField
            label="Email"
            name="email"
            type="text"
            value={this.state.email}
            onChange={this.handleChange}
          />
          <TextField
            label="Street 1"
            name="street1"
            type="text"
            value={this.state.street1}
            onChange={this.handleChange}
          />
          <TextField
            label="Street 2"
            name="street2"
            type="text"
            value={this.state.street2}
            onChange={this.handleChange}
          />
          <TextField
            label="City"
            name="city"
            type="text"
            value={this.state.city}
            onChange={this.handleChange}
          />
          <TextField
            label="State"
            name="state"
            type="text"
            value={this.state.state}
            onChange={this.handleChange}
          />
          <TextField
            label="Zip"
            name="zip"
            type="text"
            value={this.state.zip}
            onChange={this.handleChange}
          />
          <br />
          <Button type="submit" variation="primary">
            Submit
          </Button>
        </form>
        <br />
        {this.state.userID && (
          <div className="ds-c-alert ds-c-alert--success ds-l-col--12 ds-l-md-col--6">
            <div className="ds-c-alert__body">
              <h3 className="ds-c-alert__heading">User created!</h3>
              <p className="ds-c-alert__text" /> Please send the following
              upload code to{" "}
              <a href={`mailto:${this.state.emailText}`}>
                {this.state.emailText}
              </a>{" "}
              to submit their picture at{" "}
              <Link to="/">the upload tool</Link>:
              <pre>{this.state.userID}</pre>
            </div>
          </div>
        )}
      </div>
    ) : (
      <div className="ds-l-container">
        <p>No admin found!</p>
      </div>
    );
  }
}

export default RequestUpload;
