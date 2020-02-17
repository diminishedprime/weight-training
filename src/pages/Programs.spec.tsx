import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import TestWrapper from "../test-utils/TestWrapper";
import * as t from "../types";
import Programs from "./Programs";
import * as util from "./Programs/util";

configure({ adapter: new Adapter() });

describe("Programs Page", () => {
  test("/programs renders an empty div if there's no program in the url", () => {
    const wrapper = mount(
      <TestWrapper initialEntries={["/programs/"]}>
        <Programs />
      </TestWrapper>
    );
    const tables = wrapper.find(".programs-tables");
    expect(tables.text()).toEqual("");
  });

  test("/programs deadlift 3x3 renders", () => {
    const url = util.barbellLiftParams({
      workoutType: t.WorkoutType.THREE_BY_THREE,
      programName: t.LiftType.Deadlift,
      oneRepMax: t.Weight.lbs(225),
      liftType: t.LiftType.Deadlift,
      type: "barbell-program"
    });
    const wrapper = mount(
      <TestWrapper initialEntries={[url]}>
        <Programs />
      </TestWrapper>
    );
    const tables = wrapper.find(".programs-tables");
    expect(tables.text()).not.toEqual("");
  });
});
