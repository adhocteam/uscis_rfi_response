import React from "react";
import UscisApiService from "../services/UscisApiService";

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
      <div className="ds-l-container ds-u-padding-top--3 ds-u-sm-text-align--center ds-u-sm-text-align--left">
        <h2> Request Upload </h2>
        <p> Please enter a user's information to generate an upload code.</p>
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <br />
            <input
              name="name"
              type="text"
              value={this.state.name}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            DOB:
            <br />
            <input
              name="dob"
              type="text"
              value={this.state.dob}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            Email:
            <br />
            <input
              name="email"
              type="text"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            Street 1:
            <br />
            <input
              name="street1"
              type="text"
              value={this.state.street1}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            Street 2:
            <br />
            <input
              name="street2"
              type="text"
              value={this.state.street2}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            City:
            <br />
            <input
              name="city"
              type="text"
              value={this.state.city}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            State:
            <br />
            <input
              name="state"
              type="text"
              value={this.state.state}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            Zip:
            <br />
            <input
              name="zip"
              type="text"
              value={this.state.zip}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <input type="submit" value="Submit" />
        </form>
        {this.state.userID ? (
          <div>
            {" "}
            <h2> User created! </h2>
            <p>
              {" "}
              Please send this id to {this.state.emailText} to upload at{" "}
              http://uscis-rfds.adhocteam.us.s3-website-us-east-1.amazonaws.com/
            </p>
            <pre> {this.state.userID} </pre>
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
