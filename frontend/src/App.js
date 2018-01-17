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

  // stuck trying to set the state with the bytes, so i just put a fetch
  // call to send it to the server.
  readFile() {
    var preview = document.querySelector("img");

    var file = document.querySelector("input[type=file]").files[0];
    var reader = new FileReader();

    reader.addEventListener(
      "load",
      function() {
        preview.src = reader.result;
        console.log(reader.result);

        fetch("/api/upload", {
          method: "post",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            image_name: file.name,
            image_base64: reader.result,
            timestamp: new Date().toISOString()
          })
        });
      },
      false
    );

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
      </div>
    );
  }
}

export default App;
