import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import App from "./App";
import { mockAnalytics } from "./test-utils";

configure({ adapter: new Adapter() });
describe("Main happy paths", () => {
  test("Home page can render", () => {
    mockAnalytics();
    mount(<App />);
  });

  // Not really sure how I can test this as of now since I can't figure out how
  // to login.

  //  test("Can navigate to settings page", () => {
  //    authedApp({ uid: "matt" });
  //    const wrapper = mount(<App />);
  //    const navButton = wrapper.find(".test-sign-in-with-google");
  //    navButton.simulate("click");
  //    console.log(wrapper.debug());
  //    expect(wrapper.text()).toContain("nope.jpg");
  //  });
});
