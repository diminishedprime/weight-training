import { configure, mount } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import React from "react";
import { Routes } from "../App";
import * as db from "../db";
import {
  actWait,
  authedApp,
  clearApps,
  clearFirestoreData,
  initalizeTestWrapper,
  loadFirestoreRules,
  mockAnalytics
} from "../test-utils";
import * as t from "../types";
import * as util from "../util";
import EditLift from "./EditLift";

configure({ adapter: new Adapter() });
describe("Edit Lift Page", () => {
  beforeAll(async () => {
    await loadFirestoreRules();
  });

  beforeEach(async () => {
    mockAnalytics();
    window.localStorage.clear();
    await clearFirestoreData();
  });

  afterAll(async () => {
    await clearApps();
  });

  test("renders without crashing when lift provided", () => {
    // TODO this test should actually be updated so when there isn't data for a lift it can't be updated.
    const TestWrapper = initalizeTestWrapper(() => <EditLift />);
    mount(<TestWrapper />);
  });

  test("Updates reps, weight, and date when lift provided and in db", async () => {
    const app = authedApp({ uid: "test-user" });
    const lift = await db.addLift(
      app,
      { uid: "test-user" },
      t.Lift.snatch(
        util.now(),
        t.Weight.lbs(25),
        3,
        true,
        t.SnatchStyle.Full,
        t.SnatchPosition.Floor
      )
    );
    const editUrl = `/lift/${lift.uid}/edit`;
    const TestWrapper = initalizeTestWrapper(() => <Routes />, {
      initialEntries: [editUrl],
      localApp: app
    });
    const wrapper = mount(<TestWrapper />);
    await actWait(1000);
    expect(
      wrapper
        .find(".weight-input")
        .getDOMNode()
        .getAttribute("value")
    ).toBe("25");
  });
});
