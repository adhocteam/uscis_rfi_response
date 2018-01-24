import React from "react";
import { shallow } from "enzyme";
import App from "components/App.js";

test("renders", () => {
  const wrapper = shallow(<App />);
  expect(wrapper).toMatchSnapshot();
});
