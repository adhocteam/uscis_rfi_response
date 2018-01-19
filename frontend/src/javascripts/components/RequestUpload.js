import React from "react";
import UscisApiService from "../services/UscisApiService";
// import TextField from "@cmsgov/design-system-core/dist/components/TextField/TextField";
// import Button from "@cmsgov/design-system-core/dist/components/Button/Button";

class RequestUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  handleSubmit(event) {
    UscisApiService.createUser(
      this.state.name,
      this.state.dob,
      this.state.email,
      this.state.street1,
      this.state.street2,
      this.state.city,
      this.state.state,
      this.state.zip
    );
  }

  render() {
    return (
      <div className="ds-l-container ds-u-padding-top--3 ds-u-sm-text-align--center ds-u-sm-text-align--left">
        <h2> photo upload request </h2>
        <p> This form creates and sends a user a link to upload a photo.</p>
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
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
            <input
              name="zip"
              type="text"
              value={this.state.zip}
              onChange={this.handleChange}
            />
          </label>

          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default RequestUpload;
