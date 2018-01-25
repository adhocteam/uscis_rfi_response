import React from "react";
import UscisApiService from "../services/UscisApiService";
import TextField from "@cmsgov/design-system-core/dist/components/TextField/TextField";
import Button from "@cmsgov/design-system-core/dist/components/Button/Button";

class RequestUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "", admin: null };

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
      <div className="ds-l-container ds-u-sm-text-align--center ds-u-sm-text-align--left">
        <h2> Request Upload </h2>
        <p> Please enter a user's information to generate an upload code.</p>
        <form onSubmit={this.handleSubmit} className="qa-uscis-upload-form">
          <label className="ds-c-label ds-u-margin-top--0">
            Name
            <TextField
              name="name"
              type="text"
              value={this.state.name}
              onChange={this.handleChange}
            />
          </label>
          <label class="ds-c-label ds-u-margin-top--0">
            Date of Birth
            <TextField
              name="dob"
              type="text"
              value={this.state.dob}
              onChange={this.handleChange}
            />
          </label>
          <label class="ds-c-label ds-u-margin-top--0">
            Email
            <TextField
              name="email"
              type="text"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </label>
          <label class="ds-c-label ds-u-margin-top--0">
            Street 1
            <br />
            <TextField
              name="street1"
              type="text"
              value={this.state.street1}
              onChange={this.handleChange}
            />
          </label>
          <label class="ds-c-label ds-u-margin-top--0">
            Street 2
            <br />
            <TextField
              name="street2"
              type="text"
              value={this.state.street2}
              onChange={this.handleChange}
            />
          </label>
          <label class="ds-c-label ds-u-margin-top--0">
            City
            <TextField
              name="city"
              type="text"
              value={this.state.city}
              onChange={this.handleChange}
            />
          </label>
          <label class="ds-c-label ds-u-margin-top--0">
            State
            <TextField
              name="state"
              type="text"
              value={this.state.state}
              onChange={this.handleChange}
            />
          </label>
          <label class="ds-c-label ds-u-margin-top--0">
            Zip
            <TextField
              name="zip"
              type="text"
              value={this.state.zip}
              onChange={this.handleChange}
            />
          </label>
          <Button type="submit" variation="primary">
            Submit
          </Button>
        </form>
        {this.state.userID ? (
          <div>
            <div class="ds-c-alert ds-c-alert--success">
              <div class="ds-c-alert__body">
                <h3 class="ds-c-alert__heading">User created!</h3>
                <p class="ds-c-alert__text" /> Please send the following upload
                code to{" "}
                <a href="mailto:{this.state.emailText}">
                  {" "}
                  {this.state.emailText}{" "}
                </a>{" "}
                to submit their picture at{" "}
                <a href="http://uscis-rfds.adhocteam.us.s3-website-us-east-1.amazonaws.com/">
                  the upload tool:{" "}
                </a>
                <pre> {this.state.userID} </pre>
              </div>
            </div>{" "}
          </div>
        ) : (
          <div> </div>
        )}
      </div>
    ) : (
      <p>No admin found!</p>
    );
  }
}

export default RequestUpload;
