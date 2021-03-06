import React from "react";
import ReactS3Uploader from "react-s3-uploader";
import TextField from "@cmsgov/design-system-core/dist/components/TextField/TextField";
import Button from "@cmsgov/design-system-core/dist/components/Button/Button";
import UscisApiService from "../services/UscisApiService";

class UploadPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      uuid: "",
      image_base64: null,
      image_name: null,
      image_type: null,
      timestamp: null,
      success: false,
      error: false,
      errorMessage: "",
    };

    // for calling ReactS3Uploader's uploadFile from outside the component
    this.s3Uploader = null;

    this.readFile = this.readFile.bind(this);
    this.getSignedUrl = this.getSignedUrl.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.success = this.success.bind(this);
    this.onError = this.onError.bind(this);
  }

  // reads in file and sets state to file contents
  readFile() {
    const previewContainer = document.querySelector("#upload-preview");
    const preview = document.querySelector("#upload-preview img");

    const file = document.querySelector("input[type=file]").files[0];
    const reader = new FileReader();

    // on file load, loads the base64 bytes and image name into the component state
    let loadBytes = () => {
      preview.src = reader.result;
      previewContainer.style = { display: "block" };

      this.setState(p => ({
        image_base64: reader.result,
        image_name: file.name,
        image_type: file.type,
        timestamp: new Date().toISOString(),
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
  getSignedUrl(file, callback) {
    UscisApiService.getSignedUrl(
      this.state.uuid,
      this.state.image_name,
      this.state.image_type
    )
      .then(json => {
        callback(json);
      })
      .catch(e => {
        this.onError(e);
      });
  }

  success() {
    this.setState({ success: true });
  }

  onError(e) {
    this.setState({ error: true, errorMessage: e });
  }
  // on submit, validate form and call uploadFile, which will get the signed
  //   url from the API and then upload to S3.
  handleSubmit(e) {
    e.preventDefault();
    if (this.validateForm()) {
      this.s3Uploader.uploadFile();
    } else {
      this.onError("Please provide an upload code and an image.");
    }
  }

  render() {
    return (
      <div className="ds-l-container qa-uscis-upload-page">
        <h2>Upload an Image</h2>
        <p>
          Fill out your provided upload code and select your image, then hit
          submit.
        </p>
        <form onSubmit={this.handleSubmit} className="qa-uscis-upload-form">
          <TextField
            label="Upload Code"
            name="uuid"
            value={this.state.uuid}
            onChange={e => this.setState({ uuid: e.target.value })}
          />
          <ReactS3Uploader
            className="ds-c-field"
            accept="image/*"
            autoUpload={false}
            uploadRequestHeaders={{}}
            onFinish={this.success}
            onError={this.onError}
            getSignedUrl={this.getSignedUrl}
            ref={s3Uploader => {
              this.s3Uploader = s3Uploader;
            }}
            onChange={this.readFile}
          />
          <Button type="submit" variation="primary">
            Submit
          </Button>
        </form>
        <br />
        {this.state.success && (
          <div className="ds-c-alert ds-c-alert--success ds-l-col--12 ds-l-md-col--6">
            <div className="ds-c-alert__body">
              <h3 className="ds-c-alert__heading">Upload succeeded!</h3>
            </div>
          </div>
        )}
        {this.state.error && (
          <div className="ds-c-alert ds-c-alert--error ds-l-col--12 ds-l-md-col--6">
            <div className="ds-c-alert__body">
              <h3 className="ds-c-alert__heading">{this.state.errorMessage}</h3>
            </div>
          </div>
        )}
        <div id="upload-preview" style={{ display: "none" }}>
          <h3>Image Preview:</h3>
          <img src="" height="200" alt="Preview of what will be uploaded." />
        </div>
      </div>
    );
  }
}

export default UploadPage;
