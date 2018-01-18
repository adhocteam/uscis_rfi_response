import React from "react";
import UscisApiService from "../services/UscisApiService";

class RequestUpload extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: "" };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  handleSubmit(event) {
    console.log("hello world");
    UscisApiService.createUser(
      "brian",
      "04-19-1991",
      "brian.king@adhocteam.us",
      "1451 Belmont St",
      "",
      "Washington",
      "DC",
      "20009"
    );
  }

  render() {
    return (
      <div className="Upload">
        <h3> Create upload request </h3>
        <form onSubmit={this.handleSubmit}>
          <label>
            Name:
            <input
              type="text"
              value={this.state.name}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            DOB:
            <input
              type="text"
              value={this.state.dob}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            Email:
            <input
              type="text"
              value={this.state.email}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            Street 1:
            <input
              type="text"
              value={this.state.street1}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            Street 2:
            <input
              type="text"
              value={this.state.street2}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            City:
            <input
              type="text"
              value={this.state.city}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            State:
            <input
              type="text"
              value={this.state.state}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            Zip:
            <input
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
