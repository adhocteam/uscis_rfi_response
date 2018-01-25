jest.mock("services/UscisApiService");

import React from "react";
import { shallow } from "enzyme";
import NavLinks from "components/NavLinks.js";
import UscisApiService from "services/UscisApiService.js";

test("renders certain links when logged out", () => {
  const wrapper = shallow(<NavLinks />);
  expect(wrapper).toMatchSnapshot();
});

test("renders certain links when logged in", () => {
  UscisApiService.login("fake.admin@adhocteam.us", "thisisafakepassword");
  const wrapper = shallow(<NavLinks />);
  expect(wrapper).toMatchSnapshot();
});
