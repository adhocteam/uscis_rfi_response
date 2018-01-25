jest.mock("services/UscisApiService");

import React from "react";
import { shallow } from "enzyme";
import Login from "components/LoginPage.js";
import history from "services/history.js";

test("renders", () => {
  const wrapper = shallow(<Login />);
  expect(wrapper).toMatchSnapshot();
});

test("redirects on successful login", () => {
  const wrapper = shallow(<Login />);
  history.replace = jest.fn();
  wrapper.setProps({
    location: { search: "" },
  });
  wrapper.setState({
    email: "fake.admin@adhocteam.us",
    password: "thisisafakepassword",
  });
  wrapper.instance().login({
    preventDefault: jest.fn(),
  });
  return Promise.resolve().then(() => {
    expect(sessionStorage.length).toEqual(4);
    expect(history.replace).toHaveBeenCalled();
  });
});
