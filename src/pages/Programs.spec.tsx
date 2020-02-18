import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import {
  initalizeTestWrapper,
  loadFirestoreRules,
  clearFirestoreData,
  clearApps,
  authedApp
} from "../test-utils";
import * as t from "../types";
import Programs from "./Programs";
import * as util from "./Programs/util";
import store from "../store";
import * as db from "../db";

configure({ adapter: new Adapter() });

describe("Programs Page", () => {
  beforeAll(async () => {
    await loadFirestoreRules();
  });

  beforeEach(async () => {
    window.localStorage.clear();
    await clearFirestoreData();
  });

  afterAll(async () => {
    await clearApps();
  });

  test("/programs renders an empty div if there's no program in the url", () => {
    const TestWrapper = initalizeTestWrapper(() => <Programs />);
    const wrapper = mount(<TestWrapper />);
    const tables = wrapper.find(".programs-tables");
    expect(tables.text()).toEqual("");
  });

  describe("/programs deadlift 3x3", () => {
    test("renders without error", () => {
      const url = util.barbellLiftParams({
        workoutType: t.WorkoutType.THREE_BY_THREE,
        programName: t.LiftType.Deadlift,
        oneRepMax: t.Weight.lbs(225),
        liftType: t.LiftType.Deadlift,
        type: "barbell-program"
      });
      const TestWrapper = initalizeTestWrapper(() => <Programs />, {
        initialEntries: [url]
      });
      const wrapper = mount(<TestWrapper />);
      const tables = wrapper.find(".programs-tables");
      expect(tables.text()).not.toEqual("");
    });

    test("Done adds lift and moves foward", async () => {
      const url = util.barbellLiftParams({
        workoutType: t.WorkoutType.THREE_BY_THREE,
        programName: t.LiftType.Squat,
        oneRepMax: t.Weight.lbs(225),
        liftType: t.LiftType.Squat,
        type: "barbell-program"
      });
      const localApp = authedApp({ uid: "test-user" });
      const TestWrapper = initalizeTestWrapper(() => <Programs />, {
        initialEntries: [url],
        localApp
      });
      const wrapper = mount(<TestWrapper />);
      // has-background-success indicates that a lift was added successfully.
      expect(wrapper.find(".has-background-success").exists()).toBeFalsy();
      const doneButton = wrapper.find(".is-done-button");
      doneButton.simulate("click");
      // Give enough time for the lift to be added to the database.
      await sleep(1000);
      expect(wrapper.find(".has-background-success").exists()).toBeTruthy();
      const lifts = await db.lifts(localApp, { uid: "test-user" }, (a) => a);
      expect(lifts.length).toBe(1);
    });

    test("Skip does not adds lift and moves foward", async () => {
      const url = util.barbellLiftParams({
        workoutType: t.WorkoutType.THREE_BY_THREE,
        programName: t.LiftType.BenchPress,
        oneRepMax: t.Weight.lbs(225),
        liftType: t.LiftType.BenchPress,
        type: "barbell-program"
      });
      const localApp = authedApp({ uid: "test-user" });
      const TestWrapper = initalizeTestWrapper(() => <Programs />, {
        initialEntries: [url],
        localApp
      });
      const wrapper = mount(<TestWrapper />);
      // has-background-success indicates that a lift was added successfully.
      expect(wrapper.find(".has-background-warning").exists()).toBeFalsy();
      const doneButton = wrapper.find(".is-skip-button");
      doneButton.simulate("click");
      expect(wrapper.find(".has-background-warning").exists()).toBeTruthy();
      const lifts = await db.lifts(localApp, { uid: "test-user" }, (a) => a);
      expect(lifts.length).toBe(0);
    });

    test("Skip remaining does not adds lift and moves all the way forward", async () => {
      const url = util.barbellLiftParams({
        workoutType: t.WorkoutType.THREE_BY_THREE,
        programName: t.LiftType.OverheadPress,
        oneRepMax: t.Weight.lbs(225),
        liftType: t.LiftType.OverheadPress,
        type: "barbell-program"
      });
      const localApp = authedApp({ uid: "test-user" });
      const TestWrapper = initalizeTestWrapper(() => <Programs />, {
        initialEntries: [url],
        localApp
      });
      const wrapper = mount(<TestWrapper />);
      expect(wrapper.find(".has-background-warning").exists()).toBeFalsy();
      const doneButton = wrapper.find(".is-skip-remaining-button");
      doneButton.simulate("click");
      expect(wrapper.find(".has-background-warning").length).toBeGreaterThan(1);

      const lifts = await db.lifts(localApp, { uid: "test-user" }, (a) => a);
      expect(lifts.length).toBe(0);
    });
  });
});

const sleep = (ms: number): Promise<void> => {
  return new Promise((resolve) => {
    window.setTimeout(() => {
      resolve();
    }, ms);
  });
};
