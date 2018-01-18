import React from "react";
import ReactDOM from "react-dom";
import "./stylesheets/index.css";
import App from "./javascripts/components/App";
import registerServiceWorker from "./javascripts/services/registerServiceWorker";

ReactDOM.render(<App />, document.getElementById("root"));
registerServiceWorker();
