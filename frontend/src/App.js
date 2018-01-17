import React, { Component } from "react";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reader: null
    };
    this.readFile = this.readFile.bind(this);
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
  render() {
    return (
      <div className="App">
        <input className="Input" type="file" onChange={this.readFile} />
        <h3> image preview: </h3>
        <img src="" height="200" alt="Image preview..." />
        <h3> b64 bytes </h3>
        {this.state.image_base64}
        <h3> filename </h3>
        {this.state.image_name}
      </div>
    );
  }
}

export default App;
