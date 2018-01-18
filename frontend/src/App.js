import React, { Component } from "react";
import ReactS3Uploader from "react-s3-uploader";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      uuid: "",
      image_base64: null,
      image_name: null,
      image_type: null,
      timestamp: null
    };

    // for calling ReactS3Uploader's uploadFile from outside the component
    this.s3Uploader = null;

    this.readFile = this.readFile.bind(this);
    this.getSignedUrl = this.getSignedUrl.bind(this);
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

      this.setState(p => ({
        image_base64: reader.result,
        image_name: file.name,
        image_type: file.type,
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

  // messy validation; checks that uuid and image are not null.
  validateForm() {
    let validUUID = this.state.uuid && this.state.uuid !== "";
    let validImage =
      this.state.image_name && this.state.image_base64 && this.state.timestamp;
    return validUUID && validImage;
  }

  // custom function for ReactS3Uploader
  // TODO: error handling
  getSignedUrl(file, callback) {
    fetch("/api/presigned_url", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        user_id: this.state.uuid,
        image_name: this.state.image_name,
        image_type: this.state.image_type
      })
    })
      .then(resp => {
        if (resp.status === 200) {
          return resp.json();
        }
      })
      .then(json => {
        callback(json);
      });
  }

  // on submit, validate form and call uploadFile, which will get the signed
  //   url from the API and then upload to S3.
  handleSubmit(e) {
    e.preventDefault();
    if (this.validateForm()) {
      this.s3Uploader.uploadFile();
    } else {
      // TODO: Better UX for user error.
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
          <ReactS3Uploader
            autoUpload={false}
            uploadRequestHeaders={{}}
            getSignedUrl={this.getSignedUrl}
            ref={s3Uploader => {
              this.s3Uploader = s3Uploader;
            }}
            onChange={this.readFile}
          />
          <br />
          <input type="submit" value="Submit" />
        </form>

        <h3> image preview: </h3>
        <img src="" height="200" alt="Preview of what will be uploaded." />
        <h3> b64 bytes </h3>
        {this.state.image_base64}
        <h3> filename </h3>
        {this.state.image_name}
        <h3> content-type </h3>
        {this.state.image_type}
      </div>
    );
  }
}

export default App;
