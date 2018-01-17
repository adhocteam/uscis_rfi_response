import React, { Component } from "react";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reader: null,
      uuid: null,
      image_base64: null,
      image_name: null,
      timestamp: null
    };
    this.readFile = this.readFile.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  // reads in file and sets state to file contents
  readFile() {
    var preview = document.querySelector("img");

    var file = document.querySelector("input[type=file]").files[0];
    var reader = new FileReader();

    // on file load, loads the base64 bytes and image name into the component state
    let loadBytes = () => {
      preview.src = reader.result;
      console.log(reader);

      this.setState(p => ({
        image_base64: reader.result,
        image_name: file.name,
        timestamp: new Date().toISOString()
      }));
    };

    // pass component into loadBytes function
    this.loadBytes = loadBytes.bind(this);

    //load bytes
    reader.addEventListener("load", loadBytes, false);

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  validateForm() {
    let validUUID = this.state.uuid && this.state.uuid !== "";
    let validImage =
      this.state.image_name && this.state.image_base64 && this.state.timestamp;
    return validUUID && validImage;
  }

  handleSubmit(e) {
    e.preventDefault();
    if (this.validateForm()) {
      alert("Passed validation; POST to /api/upload");
    } else {
      alert("Please provide a UUID and an image.");
    }
  }

  render() {
    return (
      <div className="App">
        <h1>USCIS Uploader Front-End</h1>
        <p>
          Fill out your provided UUID and select your image, then hit submit.
        </p>
        <form onSubmit={this.handleSubmit}>
          <label>
            UUID
            <input
              type="text"
              value={this.state.uuid}
              onChange={e => this.setState({ uuid: e.target.value })}
            />
          </label>
          <br />
          <input type="file" onChange={this.readFile} />
          <br />
          <input type="submit" value="Submit" />
        </form>

        <h3> image preview: </h3>
        <img src="" height="200" alt="Preview of what will be uploaded." />
        <h3> b64 bytes </h3>
        {this.state.image_base64}
        <h3> filename </h3>
        {this.state.image_name}
      </div>
    );
  }
}

export default App;
