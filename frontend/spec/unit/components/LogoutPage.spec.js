jest.mock("services/UscisApiService");

import React from "react";
import { shallow } from "enzyme";
import Logout from "components/LogoutPage.js";
import UscisApiService from "services/UscisApiService.js";

test("renders", () => {
  const wrapper = shallow(<Logout />);
  expect(wrapper).toMatchSnapshot();
});

test("clears credentials on logout", () => {
  UscisApiService.login("fake.admin@adhocteam.us", "thisisafakepassword");
  expect(sessionStorage.length).toEqual(4);
  const wrapper = shallow(<Logout />);
  expect(sessionStorage.length).toEqual(0);
});
