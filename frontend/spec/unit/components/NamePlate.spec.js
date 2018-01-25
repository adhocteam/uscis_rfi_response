jest.mock("services/UscisApiService");

import React from "react";
import { shallow } from "enzyme";
import NamePlate from "components/NamePlate.js";
import UscisApiService from "services/UscisApiService.js";

test("renders nothing when logged out", () => {
  const wrapper = shallow(<NamePlate />);
  expect(wrapper.find(".qa-uscis-name-plate")).toHaveLength(0);
  expect(wrapper).toMatchSnapshot();
});

test("renders content when logged in", () => {
  UscisApiService.login("fake.admin@adhocteam.us", "thisisafakepassword");
  const wrapper = shallow(<NamePlate />);
  expect(wrapper.find(".qa-uscis-name-plate")).toHaveLength(1);
  expect(wrapper).toMatchSnapshot();
});
